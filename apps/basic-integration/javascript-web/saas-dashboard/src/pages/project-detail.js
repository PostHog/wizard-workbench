import posthog from 'posthog-js';
import { api } from '../api.js';
import { store } from '../store.js';
import { renderShell } from '../components/shell.js';
import { showModal } from '../components/modal.js';

const STATUS_OPTIONS = ['todo', 'in_progress', 'done'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

export async function renderProjectDetail({ id }) {
  renderShell('projects');

  const content = document.getElementById('content');
  content.innerHTML = '<div class="loading">Loading project...</div>';

  try {
    const project = await api.getProject(id);
    const members = await api.getTeamMembers();

    render(project, members);
  } catch (err) {
    content.innerHTML = `<div class="error-message">${err.message}</div>`;
  }
}

function render(project, members) {
  const content = document.getElementById('content');

  const tasksByStatus = {
    todo: project.tasks.filter((t) => t.status === 'todo'),
    in_progress: project.tasks.filter((t) => t.status === 'in_progress'),
    done: project.tasks.filter((t) => t.status === 'done'),
  };

  content.innerHTML = `
    <div class="page-header">
      <div>
        <a href="#/projects" class="back-link">&larr; Projects</a>
        <h2>${project.name}</h2>
        <p class="text-muted">${project.description}</p>
      </div>
      <button id="add-task-btn" class="btn-primary">Add Task</button>
    </div>

    <div class="board">
      ${STATUS_OPTIONS.map(
        (status) => `
        <div class="board-column" data-status="${status}">
          <div class="board-column-header">
            <h3>${formatStatus(status)}</h3>
            <span class="badge">${tasksByStatus[status].length}</span>
          </div>
          <div class="board-cards">
            ${tasksByStatus[status]
              .map(
                (task) => `
              <div class="task-card" data-task-id="${task.id}">
                <div class="task-card-header">
                  <span class="priority-dot priority-${task.priority}" title="${task.priority}"></span>
                  <span class="task-title">${task.title}</span>
                </div>
                <div class="task-card-footer">
                  ${task.assignee
                    ? `<span class="avatar-small">${members.find((m) => m.id === task.assignee)?.avatar || '??'}</span>`
                    : '<span class="unassigned">Unassigned</span>'
                  }
                  <div class="task-actions">
                    ${STATUS_OPTIONS.filter((s) => s !== status)
                      .map(
                        (s) =>
                          `<button class="btn-tiny move-task" data-task-id="${task.id}" data-status="${s}" title="Move to ${formatStatus(s)}">${statusIcon(s)}</button>`,
                      )
                      .join('')}
                    <button class="btn-tiny assign-task" data-task-id="${task.id}" title="Assign">&#x1F464;</button>
                    <button class="btn-tiny delete-task" data-task-id="${task.id}" title="Delete">&#x2715;</button>
                  </div>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      `,
      ).join('')}
    </div>
  `;

  // Add task
  document.getElementById('add-task-btn').addEventListener('click', () => {
    showModal('Add Task', `
      <form id="add-task-form">
        <label for="task-title">Title</label>
        <input type="text" id="task-title" required placeholder="Task title" />
        <label for="task-priority">Priority</label>
        <select id="task-priority">
          ${PRIORITY_OPTIONS.map((p) => `<option value="${p}">${p}</option>`).join('')}
        </select>
        <button type="submit" class="btn-primary">Add</button>
      </form>
    `, (modalEl) => {
      modalEl.querySelector('#add-task-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = modalEl.querySelector('#task-title').value;
        const priority = modalEl.querySelector('#task-priority').value;

        try {
          const task = await api.addTask(project.id, title, priority);
          posthog.capture('task_created', {
            project_id: project.id,
            task_id: task.id,
            priority: task.priority,
          });
          document.getElementById('modal-overlay')?.remove();
          const updated = await api.getProject(project.id);
          render(updated, members);
        } catch (err) {
          posthog.captureException(err);
          alert(err.message);
        }
      });
    });
  });

  // Move task status
  content.querySelectorAll('.move-task').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await api.updateTaskStatus(project.id, btn.dataset.taskId, btn.dataset.status);
      posthog.capture('task_status_updated', {
        project_id: project.id,
        task_id: btn.dataset.taskId,
        status: btn.dataset.status,
      });
      const updated = await api.getProject(project.id);
      render(updated, members);
    });
  });

  // Assign task
  content.querySelectorAll('.assign-task').forEach((btn) => {
    btn.addEventListener('click', () => {
      showModal('Assign Task', `
        <div class="assign-list">
          <button class="assign-option" data-assignee="">Unassigned</button>
          ${members.map((m) => `<button class="assign-option" data-assignee="${m.id}">${m.avatar} ${m.name}</button>`).join('')}
        </div>
      `, (modalEl) => {
        modalEl.querySelectorAll('.assign-option').forEach((opt) => {
          opt.addEventListener('click', async () => {
            await api.assignTask(project.id, btn.dataset.taskId, opt.dataset.assignee || null);
            posthog.capture('task_assignee_updated', {
              project_id: project.id,
              task_id: btn.dataset.taskId,
              assignee_id: opt.dataset.assignee || null,
            });
            document.getElementById('modal-overlay')?.remove();
            const updated = await api.getProject(project.id);
            render(updated, members);
          });
        });
      });
    });
  });

  // Delete task
  content.querySelectorAll('.delete-task').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await api.deleteTask(project.id, btn.dataset.taskId);
      posthog.capture('task_deleted', {
        project_id: project.id,
        task_id: btn.dataset.taskId,
      });
      const updated = await api.getProject(project.id);
      render(updated, members);
    });
  });
}

function formatStatus(status) {
  return status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusIcon(status) {
  switch (status) {
    case 'todo': return '&#x25CB;';
    case 'in_progress': return '&#x25D4;';
    case 'done': return '&#x2713;';
    default: return '?';
  }
}
