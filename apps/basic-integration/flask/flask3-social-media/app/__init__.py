import atexit
import logging
from logging.handlers import SMTPHandler, RotatingFileHandler
import os

from posthog import Posthog
from flask import Flask, g, request, current_app
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


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    posthog_project_token = app.config['POSTHOG_PROJECT_TOKEN']
    posthog_host = app.config['POSTHOG_HOST']
    if posthog_project_token and posthog_host:
        app.extensions['posthog'] = Posthog(
            project_api_key=posthog_project_token,
            host=posthog_host,
            enable_exception_autocapture=True,
        )
        atexit.register(app.extensions['posthog'].shutdown)

        @app.before_request
        def bind_posthog_request_context():
            posthog_context = app.extensions['posthog'].new_context(fresh=True)
            posthog_context.__enter__()
            g.posthog_context = posthog_context

            if current_user.is_authenticated:
                app.extensions['posthog'].identify_context(str(current_user.id))
            else:
                distinct_id = request.headers.get('X-POSTHOG-DISTINCT-ID')
                if distinct_id:
                    app.extensions['posthog'].identify_context(distinct_id)

            session_id = request.headers.get('X-POSTHOG-SESSION-ID')
            if session_id:
                app.extensions['posthog'].set_context_session(session_id)

        @app.teardown_request
        def close_posthog_request_context(exception):
            posthog_context = g.pop('posthog_context', None)
            if posthog_context is not None:
                posthog_context.__exit__(None, None, None)
    elif app.debug:
        missing_variable = (
            'POSTHOG_PROJECT_TOKEN'
            if not posthog_project_token else 'POSTHOG_HOST'
        )
        raise RuntimeError(
            f'{missing_variable} variable required by PostHog is missing or '
            f'un-configured, this causes events to be silently missed. This '
            f'error stops appearing once {missing_variable} is configured'
        )

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
