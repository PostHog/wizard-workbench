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
from config.posthog import posthog


class CustomLoginView(LoginView):
    form_class = LoginForm
    template_name = 'accounts/login.html'

    def form_valid(self, form):
        user = form.get_user()
        posthog.identify(
            distinct_id=str(user.id),
            properties={
                'email': user.email,
                'name': user.get_full_name() or user.username,
                'company_name': user.company_name,
            }
        )
        return super().form_valid(form)


class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('accounts:login')


class CustomPasswordResetView(PasswordResetView):
    template_name = 'accounts/password_reset.html'
    email_template_name = 'accounts/password_reset_email.html'
    subject_template_name = 'accounts/password_reset_subject.txt'
    success_url = reverse_lazy('accounts:password_reset_done')

    def form_valid(self, form):
        email = form.cleaned_data.get('email', '')
        posthog.capture(email, 'password_reset_requested', {'email': email})
        return super().form_valid(form)


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
            posthog.identify(
                distinct_id=str(user.id),
                properties={
                    'email': user.email,
                    'name': user.get_full_name() or user.username,
                    'company_name': user.company_name,
                }
            )
            posthog.capture(str(user.id), 'user_registered', {
                'username': user.username,
                'email': user.email,
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
            posthog.capture(str(request.user.id), 'profile_updated', {
                'company_name': request.user.company_name,
            })
            messages.success(request, 'Settings updated.')
            return redirect('accounts:settings')
    else:
        form = ProfileForm(instance=request.user)

    return render(request, 'accounts/settings.html', {'form': form})
