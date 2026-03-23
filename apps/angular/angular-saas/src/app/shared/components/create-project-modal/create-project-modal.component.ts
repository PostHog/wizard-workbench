import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { DataService } from '@app/@core/services/data.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { PosthogService } from '@core/services';

@Component({
  selector: 'app-create-project-modal',
  imports: [ReactiveFormsModule, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal [isOpen]="isOpen()" title="Create New Project" (close)="onClose()">
      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Project Name</label>
          <input id="name" type="text" formControlName="name" placeholder="Enter project name" aria-describedby="name-error" />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description" placeholder="Brief description of the project" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" formControlName="status">
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-outline" (click)="onClose()">Cancel</button>
          <button type="submit" class="btn-primary" [disabled]="projectForm.invalid">Create Project</button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [
    `
      .form-group {
        margin-bottom: 1rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;

          &:focus {
            outline: none;
            border-color: #f97316;
          }
        }

        textarea {
          resize: vertical;
        }

        select {
          background: white;
          cursor: pointer;
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }

      .btn-primary {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;

        &:hover:not(:disabled) {
          opacity: 0.9;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .btn-outline {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;

        &:hover {
          background: #f9fafb;
        }
      }
    `,
  ],
})
export class CreateProjectModalComponent {
  private readonly dataService = inject(DataService);
  private readonly toast = inject(HotToastService);
  private readonly fb = inject(FormBuilder);
  private readonly posthogService = inject(PosthogService);

  isOpen = input(false);
  close = output<void>();
  created = output<void>();

  projectForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    status: ['active' as 'active' | 'on-hold' | 'completed'],
  });

  onSubmit() {
    if (this.projectForm.invalid) return;

    const { name, description, status } = this.projectForm.getRawValue();

    this.dataService.addProject({ name, description, status });

    this.posthogService.posthog.capture('project_created', {
      status,
    });

    this.toast.success(`Project "${name}" created!`);
    this.projectForm.reset({ name: '', description: '', status: 'active' });
    this.created.emit();
    this.close.emit();
  }

  onClose() {
    this.projectForm.reset({ name: '', description: '', status: 'active' });
    this.close.emit();
  }
}
