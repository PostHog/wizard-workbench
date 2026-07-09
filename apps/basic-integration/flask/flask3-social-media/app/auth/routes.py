from flask import render_template, redirect, url_for, flash, request, current_app
from urllib.parse import urlsplit
from flask_login import login_user, logout_user, current_user
from flask_babel import _
from posthog import new_context
import sqlalchemy as sa
from app import db
from app.auth import bp
from app.auth.forms import LoginForm, RegistrationForm, \
    ResetPasswordRequestForm, ResetPasswordForm
from app.models import User
from app.auth.email import send_password_reset_email


def capture_posthog_event(event_name, distinct_id, properties=None, person_properties=None):
    client = current_app.posthog_client
    if not client or not distinct_id:
        return
    with new_context():
        client.set(distinct_id=distinct_id, properties=person_properties or {})
        client.capture(distinct_id=distinct_id, event=event_name,
                       properties=properties or {})


@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = db.session.scalar(
            sa.select(User).where(User.username == form.username.data))
        if user is None or not user.check_password(form.password.data):
            flash(_('Invalid username or password'))
            return redirect(url_for('auth.login'))
        login_user(user, remember=form.remember_me.data)
        capture_posthog_event(
            'user_logged_in',
            distinct_id=str(user.id),
            properties={
                'login_method': 'password',
                'remember_me': form.remember_me.data,
                '$current_url': request.url,
                '$request_method': request.method,
                '$request_path': request.path,
            },
            person_properties={
                'username': user.username,
                'email': user.email,
            },
        )
        next_page = request.args.get('next')
        if not next_page or urlsplit(next_page).netloc != '':
            next_page = url_for('main.index')
        return redirect(next_page)
    return render_template('auth/login.html', title=_('Sign In'), form=form)


@bp.route('/logout')
def logout():
    if current_user.is_authenticated:
        capture_posthog_event(
            'user_logged_out',
            distinct_id=str(current_user.id),
            properties={
                '$current_url': request.url,
                '$request_method': request.method,
                '$request_path': request.path,
            },
            person_properties={
                'username': current_user.username,
                'email': current_user.email,
            },
        )
    logout_user()
    return redirect(url_for('main.index'))


@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        capture_posthog_event(
            'user_signed_up',
            distinct_id=str(user.id),
            properties={
                'signup_method': 'form',
                '$current_url': request.url,
                '$request_method': request.method,
                '$request_path': request.path,
            },
            person_properties={
                'username': user.username,
                'email': user.email,
            },
        )
        flash(_('Congratulations, you are now a registered user!'))
        return redirect(url_for('auth.login'))
    return render_template('auth/register.html', title=_('Register'),
                           form=form)


@bp.route('/reset_password_request', methods=['GET', 'POST'])
def reset_password_request():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = ResetPasswordRequestForm()
    if form.validate_on_submit():
        user = db.session.scalar(
            sa.select(User).where(User.email == form.email.data))
        if user:
            send_password_reset_email(user)
            capture_posthog_event(
                'password_reset_requested',
                distinct_id=str(user.id),
                properties={
                    '$current_url': request.url,
                    '$request_method': request.method,
                    '$request_path': request.path,
                },
                person_properties={
                    'username': user.username,
                    'email': user.email,
                },
            )
        flash(
            _('Check your email for the instructions to reset your password'))
        return redirect(url_for('auth.login'))
    return render_template('auth/reset_password_request.html',
                           title=_('Reset Password'), form=form)


@bp.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    user = User.verify_reset_password_token(token)
    if not user:
        return redirect(url_for('main.index'))
    form = ResetPasswordForm()
    if form.validate_on_submit():
        user.set_password(form.password.data)
        db.session.commit()
        capture_posthog_event(
            'password_reset_completed',
            distinct_id=str(user.id),
            properties={
                '$current_url': request.url,
                '$request_method': request.method,
                '$request_path': request.path,
            },
            person_properties={
                'username': user.username,
                'email': user.email,
            },
        )
        flash(_('Your password has been reset.'))
        return redirect(url_for('auth.login'))
    return render_template('auth/reset_password.html', form=form)
