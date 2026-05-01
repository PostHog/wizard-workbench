import posthog
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from datetime import timedelta
from .models import Project, ActivityLog
from .forms import ProjectForm


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

            with posthog.new_context():
                posthog.identify_context(str(request.user.id))
                posthog.capture('project_created', properties={
                    'is_active': project.is_active,
                })

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
            form.save()

            ActivityLog.objects.create(
                user=request.user,
                action='project_updated',
                description=f'Updated project: {project.name}'
            )

            with posthog.new_context():
                posthog.identify_context(str(request.user.id))
                posthog.capture('project_updated', properties={
                    'is_active': project.is_active,
                })

            messages.success(request, 'Project updated.')
            return redirect('dashboard:projects')
    else:
        form = ProjectForm(instance=project)

    return render(request, 'dashboard/edit_project.html', {'form': form, 'project': project})


@login_required
def delete_project(request, pk):
    project = get_object_or_404(Project, pk=pk, owner=request.user)

    if request.method == 'POST':
        name = project.name
        project.delete()

        ActivityLog.objects.create(
            user=request.user,
            action='project_deleted',
            description=f'Deleted project: {name}'
        )

        with posthog.new_context():
            posthog.identify_context(str(request.user.id))
            posthog.capture('project_deleted')

        messages.success(request, 'Project deleted.')
        return redirect('dashboard:projects')

    return render(request, 'dashboard/delete_project.html', {'project': project})
