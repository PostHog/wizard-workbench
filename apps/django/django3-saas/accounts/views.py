import posthog
from posthog import new_context, identify_context, tag, capture
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


class CustomLoginView(LoginView):
    form_class = LoginForm
    template_name = 'accounts/login.html'

    def form_valid(self, form):
        user = form.get_user()
        response = super().form_valid(form)
        # PostHog: Identify user and capture login event
        with new_context():
            identify_context(str(user.id))
            tag('email', user.email)
            tag('username', user.username)
            tag('name', user.get_full_name() or user.username)
            tag('company_name', user.company_name)
            capture('user_logged_in', properties={
                'login_method': 'email',
            })
        return response


class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('accounts:login')

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            user_id = str(request.user.id)
            # PostHog: Track logout before session ends
            with new_context():
                identify_context(user_id)
                capture('user_logged_out')
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
            # PostHog: Identify new user and capture signup event
            with new_context():
                identify_context(str(user.id))
                tag('email', user.email)
                tag('username', user.username)
                tag('name', user.get_full_name() or user.username)
                tag('company_name', user.company_name)
                capture('user_signed_up', properties={
                    'signup_method': 'email',
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
            # PostHog: Track profile update
            with new_context():
                identify_context(str(request.user.id))
                tag('email', request.user.email)
                tag('name', request.user.get_full_name() or request.user.username)
                tag('company_name', request.user.company_name)
                capture('profile_updated')
            messages.success(request, 'Settings updated.')
            return redirect('accounts:settings')
    else:
        form = ProfileForm(instance=request.user)

    return render(request, 'accounts/settings.html', {'form': form})
