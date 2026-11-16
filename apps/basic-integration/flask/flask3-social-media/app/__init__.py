import atexit
import logging
from logging.handlers import SMTPHandler, RotatingFileHandler
import os
from flask import Flask, request, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, current_user
from flask_mail import Mail
from flask_moment import Moment
from flask_babel import Babel, lazy_gettext as _l
from posthog import Posthog
from posthog.integrations.flask import PosthogFlaskIntegration
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


def identify_posthog_user(user, update_properties=False):
    """Bind a user to the active PostHog request context."""
    posthog_client = current_app.posthog
    if posthog_client is None:
        return

    distinct_id = str(user.id)
    posthog_client.identify_context(distinct_id)
    if update_properties:
        posthog_client.set(
            distinct_id=distinct_id,
            properties={
                'email': user.email,
                'username': user.username,
            },
        )


def configure_posthog_log_capture(app):
    """Export only the dedicated PostHog operational logger via OTLP."""
    from opentelemetry.exporter.otlp.proto.http._log_exporter import \
        OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    from opentelemetry.sdk.resources import Resource

    logger_provider = LoggerProvider(
        resource=Resource.create({'service.name': 'microblog'}))
    exporter = OTLPLogExporter(
        endpoint=f"{app.config['POSTHOG_HOST'].rstrip('/')}/i/v1/logs",
        headers={
            'Authorization': f"Bearer {app.config['POSTHOG_API_KEY']}"
        },
    )
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    posthog_logger = logging.getLogger('microblog.posthog_logs')
    posthog_logger.setLevel(logging.INFO)
    posthog_logger.addHandler(LoggingHandler(logger_provider=logger_provider))
    posthog_logger.propagate = False
    app.posthog_logger = posthog_logger
    atexit.register(logger_provider.shutdown)
    posthog_logger.info('PostHog log capture configured')


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

    app.posthog = None
    app.posthog_logger = None
    if app.config['POSTHOG_API_KEY'] and app.config['POSTHOG_HOST']:
        app.posthog = Posthog(
            app.config['POSTHOG_API_KEY'],
            host=app.config['POSTHOG_HOST'],
            enable_exception_autocapture=True,
        )
        PosthogFlaskIntegration(
            app,
            client=app.posthog,
            capture_exceptions=True,
        )
        configure_posthog_log_capture(app)
        atexit.register(app.posthog.shutdown)
    elif app.debug:
        missing_key = (
            'POSTHOG_API_KEY' if not app.config['POSTHOG_API_KEY']
            else 'POSTHOG_HOST'
        )
        app.logger.warning(
            '%s variable required by PostHog is missing or un-configured, '
            'this causes events to be silently missed. This error stops '
            'appearing once %s is configured', missing_key, missing_key)

    @app.before_request
    def identify_authenticated_request():
        if current_user.is_authenticated:
            identify_posthog_user(current_user)

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
