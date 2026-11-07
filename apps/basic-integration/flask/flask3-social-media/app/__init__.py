import atexit
import logging
from logging.handlers import SMTPHandler, RotatingFileHandler
import os
from flask import Flask, request, current_app
from posthog import Posthog, identify_context
from posthog.integrations.flask import PosthogFlaskIntegration
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, current_user
from flask_mail import Mail
from flask_moment import Moment
from flask_babel import Babel, lazy_gettext as _l
try:
    from elasticsearch import Elasticsearch
except ImportError:
    Elasticsearch = None
try:
    from redis import Redis
    import rq
except ImportError:
    Redis = None
    rq = None
from config import Config


def get_locale():
    return request.accept_languages.best_match(current_app.config['LANGUAGES'])


db = SQLAlchemy()
migrate = Migrate()
login = LoginManager()
login.login_view = 'auth.login'
login.login_message = _l('Please log in to access this page.')
mail = Mail()
moment = Moment()
babel = Babel()


def identify_user(user):
    """Bind a user to the active PostHog request context."""
    if current_app.extensions.get('posthog'):
        identify_context(str(user.id))


def set_user_person_properties(user):
    """Store user PII as PostHog person properties, not event properties."""
    posthog_client = current_app.extensions.get('posthog')
    if posthog_client:
        posthog_client.set(
            distinct_id=str(user.id),
            properties={
                'email': user.email,
                'username': user.username,
            },
        )


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    login.init_app(app)
    mail.init_app(app)
    moment.init_app(app)
    babel.init_app(app, locale_selector=get_locale)
    app.elasticsearch = Elasticsearch([app.config['ELASTICSEARCH_URL']]) \
        if Elasticsearch and app.config['ELASTICSEARCH_URL'] else None
    if Redis and rq:
        app.redis = Redis.from_url(app.config['REDIS_URL'])
        app.task_queue = rq.Queue('microblog-tasks', connection=app.redis)
    else:
        app.redis = None
        app.task_queue = None

    posthog_api_key = app.config['POSTHOG_API_KEY']
    posthog_host = app.config['POSTHOG_HOST']
    if posthog_api_key and posthog_host:
        posthog_client = Posthog(
            posthog_api_key,
            host=posthog_host,
            enable_exception_autocapture=True,
        )
        PosthogFlaskIntegration(
            app,
            client=posthog_client,
            capture_exceptions=True,
        )
        atexit.register(posthog_client.shutdown)
        app.extensions['posthog'] = posthog_client

        from opentelemetry.exporter.otlp.proto.http._log_exporter import \
            OTLPLogExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

        posthog_log_provider = LoggerProvider()
        posthog_log_exporter = OTLPLogExporter(
            endpoint=f"{posthog_host.rstrip('/')}/i/v1/logs",
            headers={'Authorization': f'Bearer {posthog_api_key}'},
        )
        posthog_log_provider.add_log_record_processor(
            BatchLogRecordProcessor(posthog_log_exporter)
        )
        posthog_log_logger = logging.getLogger('microblog.posthog_logs')
        posthog_log_logger.setLevel(logging.INFO)
        posthog_log_logger.propagate = False
        posthog_log_logger.addHandler(
            LoggingHandler(logger_provider=posthog_log_provider)
        )
        app.extensions['posthog_log_logger'] = posthog_log_logger
        atexit.register(posthog_log_provider.shutdown)
    elif app.debug or app.testing:
        if not posthog_api_key:
            app.logger.warning(
                'POSTHOG_API_KEY variable required by PostHog is missing or '
                'un-configured, this causes events to be silently missed. This '
                'error stops appearing once POSTHOG_API_KEY is configured'
            )
        if not posthog_host:
            app.logger.warning(
                'POSTHOG_HOST variable required by PostHog is missing or '
                'un-configured, this causes events to be silently missed. This '
                'error stops appearing once POSTHOG_HOST is configured'
            )

    @app.before_request
    def identify_authenticated_request_user():
        if current_user.is_authenticated:
            identify_user(current_user)

    from app.errors import bp as errors_bp
    app.register_blueprint(errors_bp)

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.cli import bp as cli_bp
    app.register_blueprint(cli_bp)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    if not app.debug and not app.testing:
        if app.config['MAIL_SERVER']:
            auth = None
            if app.config['MAIL_USERNAME'] or app.config['MAIL_PASSWORD']:
                auth = (app.config['MAIL_USERNAME'],
                        app.config['MAIL_PASSWORD'])
            secure = None
            if app.config['MAIL_USE_TLS']:
                secure = ()
            mail_handler = SMTPHandler(
                mailhost=(app.config['MAIL_SERVER'], app.config['MAIL_PORT']),
                fromaddr='no-reply@' + app.config['MAIL_SERVER'],
                toaddrs=app.config['ADMINS'], subject='Microblog Failure',
                credentials=auth, secure=secure)
            mail_handler.setLevel(logging.ERROR)
            app.logger.addHandler(mail_handler)

        if app.config['LOG_TO_STDOUT']:
            stream_handler = logging.StreamHandler()
            stream_handler.setLevel(logging.INFO)
            app.logger.addHandler(stream_handler)
        else:
            if not os.path.exists('logs'):
                os.mkdir('logs')
            file_handler = RotatingFileHandler('logs/microblog.log',
                                               maxBytes=10240, backupCount=10)
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s '
                '[in %(pathname)s:%(lineno)d]'))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info('Microblog startup')

    return app


from app import models
