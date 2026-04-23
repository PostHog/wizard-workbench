import { computed, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: Date;
  memberIds: string[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar: string;
  joinedAt: Date;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: Date;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  /** Projects signal */
  readonly projects = signal<Project[]>([
    {
      id: '1',
      name: 'Marketing Campaign',
      description: 'Q1 2024 marketing initiative',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      memberIds: ['1', '2'],
    },
    {
      id: '2',
      name: 'Product Launch',
      description: 'New feature rollout',
      status: 'active',
      createdAt: new Date('2024-01-20'),
      memberIds: ['1'],
    },
  ]);

  /** Members signal */
  readonly members = signal<Member[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      role: 'admin',
      avatar: '👩',
      joinedAt: new Date('2023-06-01'),
    },
    {
      id: '2',
      name: 'Alex Rivera',
      email: 'alex@example.com',
      role: 'member',
      avatar: '👨',
      joinedAt: new Date('2023-08-15'),
    },
  ]);

  /** Activities signal */
  readonly activities = signal<Activity[]>([]);

  /** Computed stats signal */
  readonly stats = computed(() => ({
    totalProjects: this.projects().length,
    activeProjects: this.projects().filter((p) => p.status === 'active').length,
    totalMembers: this.members().length,
    recentActivities: this.activities().length,
  }));

  // Observable bridges for legacy consumers
  readonly projects$ = toObservable(this.projects);
  readonly members$ = toObservable(this.members);
  readonly activities$ = toObservable(this.activities);

  constructor() {
    // Initialize with some activities
    this.addActivity('System', 'initialized', 'workspace');
  }

  // Projects
  getProjects(): Observable<Project[]> {
    return this.projects$;
  }

  getProjectsSnapshot(): Project[] {
    return this.projects();
  }

  addProject(project: Omit<Project, 'id' | 'createdAt' | 'memberIds'>): Project {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      memberIds: [],
    };
    this.projects.update((current) => [newProject, ...current]);
    this.addActivity('You', 'created project', project.name);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): void {
    this.projects.update((current) => current.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }

  deleteProject(id: string): void {
    const project = this.projects().find((p) => p.id === id);
    this.projects.update((current) => current.filter((p) => p.id !== id));
    if (project) {
      this.addActivity('You', 'deleted project', project.name);
    }
  }

  // Members
  getMembers(): Observable<Member[]> {
    return this.members$;
  }

  getMembersSnapshot(): Member[] {
    return this.members();
  }

  addMember(member: Omit<Member, 'id' | 'joinedAt'>): Member {
    const newMember: Member = {
      ...member,
      id: crypto.randomUUID(),
      joinedAt: new Date(),
    };
    this.members.update((current) => [newMember, ...current]);
    this.addActivity('You', 'added team member', member.name);
    return newMember;
  }

  updateMember(id: string, updates: Partial<Member>): void {
    this.members.update((current) => current.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }

  deleteMember(id: string): void {
    const member = this.members().find((m) => m.id === id);
    this.members.update((current) => current.filter((m) => m.id !== id));
    if (member) {
      this.addActivity('You', 'removed team member', member.name);
    }
  }

  // Activities
  getActivities(): Observable<Activity[]> {
    return this.activities$;
  }

  getActivitiesSnapshot(): Activity[] {
    return this.activities();
  }

  addActivity(user: string, action: string, target: string): void {
    const avatars = ['👤', '👩', '👨', '🧑', '👩‍💼', '👨‍💼'];
    const activity: Activity = {
      id: crypto.randomUUID(),
      user,
      action,
      target,
      time: new Date(),
      avatar: user === 'You' ? '👤' : avatars[Math.floor(Math.random() * avatars.length)],
    };
    // Keep only last 20 activities
    this.activities.update((current) => [activity, ...current].slice(0, 20));
  }

  // Stats (legacy method - prefer using stats signal directly)
  getStats() {
    return this.stats();
  }
}
