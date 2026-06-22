import posthog from 'posthog-js';
import { api } from '../api.js';
import { router } from '../router.js';
import { renderShell } from '../components/shell.js';
import { showModal } from '../components/modal.js';

export async function renderProjects() {
  renderShell('projects');

  const content = document.getElementById('content');
  content.innerHTML = '<div class="loading">Loading projects...</div>';

  try {
    const projects = await api.getProjects();

    content.innerHTML = `
      <div class="page-header">
        <h2>Projects</h2>
        <button id="new-project-btn" class="btn-primary">New Project</button>
      </div>

      <div class="projects-table">
        <div class="table-header">
          <span class="col-name">Name</span>
          <span class="col-status">Status</span>
          <span class="col-tasks">Tasks</span>
          <span class="col-progress">Progress</span>
          <span class="col-actions">Actions</span>
        </div>
        ${projects
          .map((p) => {
            const done = p.tasks.filter((t) => t.status === 'done').length;
            const pct = p.tasks.length > 0 ? Math.round((done / p.tasks.length) * 100) : 0;

            return `
            <div class="table-row" data-id="${p.id}">
              <span class="col-name">
                <a href="#/projects/${p.id}">${p.name}</a>
                <small>${p.description}</small>
              </span>
              <span class="col-status">
                <span class="badge badge-${p.status}">${p.status}</span>
              </span>
              <span class="col-tasks">${p.tasks.length}</span>
              <span class="col-progress">
                <div class="progress-track small">
                  <div class="progress-fill done" style="width: ${pct}%"></div>
                </div>
                <small>${pct}%</small>
              </span>
              <span class="col-actions">
                <button class="btn-icon delete-project" data-id="${p.id}" title="Delete">&#x2715;</button>
              </span>
            </div>
          `;
          })
          .join('')}
      </div>
    `;

    // New project
    document.getElementById('new-project-btn').addEventListener('click', () => {
      showModal('New Project', `
        <form id="new-project-form">
          <label for="proj-name">Name</label>
          <input type="text" id="proj-name" required placeholder="Project name" />
          <label for="proj-desc">Description</label>
          <textarea id="proj-desc" rows="3" placeholder="Brief description"></textarea>
          <button type="submit" class="btn-primary">Create</button>
        </form>
      `, (modalEl) => {
        modalEl.querySelector('#new-project-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = modalEl.querySelector('#proj-name').value;
          const desc = modalEl.querySelector('#proj-desc').value;

          try {
            const project = await api.createProject(name, desc);
            posthog.capture('project_created', {
              project_id: project.id,
              project_name: project.name,
            });
            router.navigate(`/projects/${project.id}`);
          } catch (err) {
            posthog.captureException(err);
            alert(err.message);
          }
        });
      });
    });

    // Delete project
    content.querySelectorAll('.delete-project').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (confirm('Delete this project and all its tasks?')) {
          await api.deleteProject(id);
          posthog.capture('project_deleted', { project_id: id });
          renderProjects();
        }
      });
    });
  } catch (err) {
    content.innerHTML = `<div class="error-message">Failed to load projects: ${err.message}</div>`;
  }
}
