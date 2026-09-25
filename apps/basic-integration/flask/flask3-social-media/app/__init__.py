import atexit
import logging
from logging.handlers import SMTPHandler, RotatingFileHandler
import os
from flask import Flask, g, request, current_app
from posthog import Posthog
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
posthog_client = None
posthog_log_handler = None
posthog_log_provider = None
posthog_logs_logger = logging.getLogger('posthog.export')
posthog_logs_logger.setLevel(logging.INFO)
posthog_logs_logger.propagate = False


def configure_posthog_log_capture(posthog_api_key, posthog_host):
    """Export only this integration's dedicated logger through OTLP."""
    global posthog_log_handler, posthog_log_provider

    if posthog_log_handler is not None:
        return

    from opentelemetry.exporter.otlp.proto.http._log_exporter import \
        OTLPLogExporter
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

    posthog_log_provider = LoggerProvider()
    posthog_log_provider.add_log_record_processor(BatchLogRecordProcessor(
        OTLPLogExporter(
            endpoint=f'{posthog_host.rstrip("/")}/i/v1/logs',
            headers={'Authorization': f'Bearer {posthog_api_key}'},
        )))
    posthog_log_handler = LoggingHandler(logger_provider=posthog_log_provider)
    posthog_logs_logger.addHandler(posthog_log_handler)
    atexit.register(posthog_log_provider.shutdown)


def create_app(config_class=Config):
    global posthog_client

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
    if not posthog_api_key or not posthog_host:
        if app.debug:
            missing_var = 'POSTHOG_API_KEY' if not posthog_api_key else 'POSTHOG_HOST'
            raise RuntimeError(
                f'{missing_var} variable required by PostHog is missing or '
                f'un-configured, this causes events to be silently missed. '
                f'This error stops appearing once {missing_var} is configured')
    else:
        posthog_client = Posthog(
            posthog_api_key,
            host=posthog_host,
            enable_exception_autocapture=True,
        )
        atexit.register(posthog_client.shutdown)
        configure_posthog_log_capture(posthog_api_key, posthog_host)
        posthog_logs_logger.info('PostHog log capture initialized')

    @app.before_request
    def start_posthog_request_context():
        if posthog_client is None:
            return

        context = posthog_client.new_context(fresh=True)
        context.__enter__()
        g.posthog_context = context

        if current_user.is_authenticated:
            posthog_client.identify_context(str(current_user.id))
        else:
            distinct_id = request.headers.get('X-POSTHOG-DISTINCT-ID')
            if distinct_id:
                posthog_client.identify_context(distinct_id)

        session_id = request.headers.get('X-POSTHOG-SESSION-ID')
        if session_id:
            posthog_client.set_context_session(session_id)

    @app.teardown_request
    def end_posthog_request_context(error=None):
        context = g.pop('posthog_context', None)
        if context is not None:
            context.__exit__(
                type(error) if error is not None else None,
                error,
                error.__traceback__ if error is not None else None,
            )

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
