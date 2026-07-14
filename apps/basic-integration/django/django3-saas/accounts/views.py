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
from posthog import new_context
from config.posthog import posthog_client
from .forms import RegisterForm, LoginForm, ProfileForm


class CustomLoginView(LoginView):
    form_class = LoginForm
    template_name = 'accounts/login.html'

    def form_valid(self, form):
        response = super().form_valid(form)
        user = self.request.user

        with posthog_client.new_context():
            posthog_client.identify_context(str(user.pk))
            posthog_client.set(
                distinct_id=str(user.pk),
                properties={
                    'email': user.email,
                    'username': user.username,
                    'company_name': user.company_name or '',
                    'is_staff': user.is_staff,
                },
            )
            posthog_client.capture(
                'user_logged_in',
                properties={
                    'login_method': 'password',
                    'has_company_name': bool(user.company_name),
                },
            )

        return response


class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('accounts:login')

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            with new_context():
                posthog_client.identify_context(str(request.user.pk))
                posthog_client.capture(
                    'user_logged_out',
                    properties={
                        'was_subscribed': request.user.is_subscribed(),
                    },
                )
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

            with new_context():
                posthog_client.identify_context(str(user.pk))
                posthog_client.set(
                    distinct_id=str(user.pk),
                    properties={
                        'email': user.email,
                        'username': user.username,
                        'company_name': user.company_name or '',
                        'is_staff': user.is_staff,
                    },
                )
                posthog_client.capture(
                    'user_registered',
                    properties={
                        'has_company_name': bool(user.company_name),
                        'is_email_verified': user.is_email_verified(),
                    },
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
            user = form.save()
            posthog_client.set(
                distinct_id=str(user.pk),
                properties={
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'company_name': user.company_name or '',
                },
            )
            posthog_client.capture(
                'profile_updated',
                distinct_id=str(user.pk),
                properties={
                    'has_company_name': bool(user.company_name),
                    'has_name': bool(user.first_name or user.last_name),
                },
            )
            messages.success(request, 'Settings updated.')
            return redirect('accounts:settings')
    else:
        form = ProfileForm(instance=request.user)

    return render(request, 'accounts/settings.html', {'form': form})
