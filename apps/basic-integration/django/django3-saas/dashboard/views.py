from datetime import timedelta

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from posthog import new_context

from config.posthog import posthog_client
from .forms import ProjectForm
from .models import ActivityLog, Project


@login_required
def index(request):
    projects = request.user.projects.all()[:5]
    activities = request.user.activities.all()[:10]
    subscription = request.user.get_active_subscription()

    # Calculate usage metrics for the user
    now = timezone.now()
    thirty_days_ago = now - timedelta(days=30)

    metrics = {
        'project_count': request.user.projects.count(),
        'active_projects': request.user.projects.filter(is_active=True).count(),
        'activities_this_month': request.user.activities.filter(
            created_at__gte=thirty_days_ago
        ).count(),
    }

    # Add subscription info
    if subscription:
        days_remaining = (subscription.current_period_end - now).days
        metrics['days_remaining'] = max(0, days_remaining)
        metrics['plan_name'] = subscription.plan.name

    return render(request, 'dashboard/index.html', {
        'projects': projects,
        'activities': activities,
        'subscription': subscription,
        'metrics': metrics,
    })


@login_required
def projects(request):
    projects = request.user.projects.all()
    return render(request, 'dashboard/projects.html', {'projects': projects})


@login_required
def create_project(request):
    if request.method == 'POST':
        form = ProjectForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            project.owner = request.user
            project.save()

            ActivityLog.objects.create(
                user=request.user,
                action='project_created',
                description=f'Created project: {project.name}'
            )

            with new_context():
                posthog_client.identify_context(str(request.user.pk))
                posthog_client.capture(
                    'project_created',
                    properties={
                        'project_id': project.pk,
                        'name_length': len(project.name),
                        'has_description': bool(project.description),
                        'is_active': project.is_active,
                    },
                )

            messages.success(request, 'Project created.')
            return redirect('dashboard:projects')
    else:
        form = ProjectForm()

    return render(request, 'dashboard/create_project.html', {'form': form})


@login_required
def edit_project(request, pk):
    project = get_object_or_404(Project, pk=pk, owner=request.user)

    if request.method == 'POST':
        form = ProjectForm(request.POST, instance=project)
        if form.is_valid():
            project = form.save()

            ActivityLog.objects.create(
                user=request.user,
                action='project_updated',
                description=f'Updated project: {project.name}'
            )

            with new_context():
                posthog_client.identify_context(str(request.user.pk))
                posthog_client.capture(
                    'project_updated',
                    properties={
                        'project_id': project.pk,
                        'name_length': len(project.name),
                        'has_description': bool(project.description),
                        'is_active': project.is_active,
                    },
                )

            messages.success(request, 'Project updated.')
            return redirect('dashboard:projects')
    else:
        form = ProjectForm(instance=project)

    return render(request, 'dashboard/edit_project.html', {'form': form, 'project': project})


@login_required
def delete_project(request, pk):
    project = get_object_or_404(Project, pk=pk, owner=request.user)

    if request.method == 'POST':
        project_id = project.pk
        name = project.name
        had_description = bool(project.description)
        was_active = project.is_active
        project.delete()

        ActivityLog.objects.create(
            user=request.user,
            action='project_deleted',
            description=f'Deleted project: {name}'
        )

        with new_context():
            posthog_client.identify_context(str(request.user.pk))
            posthog_client.capture(
                'project_deleted',
                properties={
                    'project_id': project_id,
                    'name_length': len(name),
                    'had_description': had_description,
                    'was_active': was_active,
                },
            )

        messages.success(request, 'Project deleted.')
        return redirect('dashboard:projects')

    return render(request, 'dashboard/delete_project.html', {'project': project})
