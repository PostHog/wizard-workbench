from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import (
    LoginView, LogoutView,
    PasswordResetView, PasswordResetDoneView,
    PasswordResetConfirmView, PasswordResetCompleteView
)
from django.contrib import messages
from django.urls import reverse_lazy
from .forms import RegisterForm, LoginForm, ProfileForm
from config import posthog_client as _ph


class CustomLoginView(LoginView):
    form_class = LoginForm
    template_name = 'accounts/login.html'

    def form_valid(self, form):
        response = super().form_valid(form)
        user = form.get_user()
        if _ph.posthog_client:
            with _ph.posthog_client.new_context():
                _ph.posthog_client.identify_context(str(user.id))
                _ph.posthog_client.tag('username', user.username)
                _ph.posthog_client.tag('date_joined', user.date_joined.isoformat())
                _ph.posthog_client.capture('user_logged_in', properties={
                    'login_method': 'email',
                })
        return response


class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('accounts:login')

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated and _ph.posthog_client:
            with _ph.posthog_client.new_context():
                _ph.posthog_client.identify_context(str(request.user.id))
                _ph.posthog_client.capture('user_logged_out')
        return super().dispatch(request, *args, **kwargs)


class CustomPasswordResetView(PasswordResetView):
    template_name = 'accounts/password_reset.html'
    email_template_name = 'accounts/password_reset_email.html'
    subject_template_name = 'accounts/password_reset_subject.txt'
    success_url = reverse_lazy('accounts:password_reset_done')


class CustomPasswordResetDoneView(PasswordResetDoneView):
    template_name = 'accounts/password_reset_done.html'


class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'accounts/password_reset_confirm.html'
    success_url = reverse_lazy('accounts:password_reset_complete')


class CustomPasswordResetCompleteView(PasswordResetCompleteView):
    template_name = 'accounts/password_reset_complete.html'


def register(request):
    if request.user.is_authenticated:
        return redirect('dashboard:index')

    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            if _ph.posthog_client:
                with _ph.posthog_client.new_context():
                    _ph.posthog_client.identify_context(str(user.id))
                    _ph.posthog_client.tag('username', user.username)
                    _ph.posthog_client.tag('date_joined', user.date_joined.isoformat())
                    _ph.posthog_client.capture('user_registered', properties={
                        'registration_method': 'email',
                    })
            messages.success(request, 'Registration successful. Welcome!')
            return redirect('dashboard:index')
    else:
        form = RegisterForm()

    return render(request, 'accounts/register.html', {'form': form})


@login_required
def settings(request):
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            if _ph.posthog_client:
                with _ph.posthog_client.new_context():
                    _ph.posthog_client.identify_context(str(request.user.id))
                    _ph.posthog_client.capture('profile_updated', properties={
                        'fields_changed': list(form.changed_data),
                    })
            messages.success(request, 'Settings updated.')
            return redirect('accounts:settings')
    else:
        form = ProfileForm(instance=request.user)

    return render(request, 'accounts/settings.html', {'form': form})
