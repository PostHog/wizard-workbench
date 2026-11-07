from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.views import (
    LoginView, LogoutView,
    PasswordResetView, PasswordResetDoneView,
    PasswordResetConfirmView, PasswordResetCompleteView
)
from django.contrib import messages
from django.dispatch import receiver
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from posthog import identify_context

from .forms import RegisterForm, LoginForm, ProfileForm


@receiver(user_logged_in)
def identify_posthog_user(sender, request, user, **kwargs):
    """Identify the login request after Django has authenticated the user."""
    user_id = str(user.pk)
    identify_context(user_id)

    posthog_client = settings.POSTHOG_MW_CLIENT
    if posthog_client is not None:
        posthog_client.set(
            distinct_id=user_id,
            properties={
                'email': user.email,
                'username': user.username,
                'name': user.get_full_name() or user.username,
                'company_name': user.company_name,
                'is_staff': user.is_staff,
            },
        )


class CustomLoginView(LoginView):
    form_class = LoginForm
    template_name = 'accounts/login.html'

    def form_valid(self, form):
        response = super().form_valid(form)
        posthog_client = settings.POSTHOG_MW_CLIENT
        if posthog_client is not None:
            posthog_client.capture(
                'user_logged_in',
                properties={'login_method': 'password'},
            )
        return response


class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('accounts:login')

    def post(self, request, *args, **kwargs):
        posthog_client = settings.POSTHOG_MW_CLIENT
        if posthog_client is not None:
            posthog_client.capture('user_logged_out')
        return super().post(request, *args, **kwargs)


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
            posthog_client = settings.POSTHOG_MW_CLIENT
            if posthog_client is not None:
                posthog_client.capture('user_registered')
            if settings.POSTHOG_LOGGER is not None:
                settings.POSTHOG_LOGGER.info(
                    'user_registered',
                    extra={'operation': 'user_registration'},
                )
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
            posthog_client = settings.POSTHOG_MW_CLIENT
            if posthog_client is not None:
                posthog_client.capture('account_settings_updated')
            messages.success(request, 'Settings updated.')
            return redirect('accounts:settings')
    else:
        form = ProfileForm(instance=request.user)

    return render(request, 'accounts/settings.html', {'form': form})
