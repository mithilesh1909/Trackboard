import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { User, Task } from '../../models/task.model';

@Component({ selector: 'app-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss'] })
export class DashboardComponent implements OnInit {
  user: User | null = null;
  activeView = 'board';
  modalVisible = false;
  editingTask: Task | null = null;
  searchQuery = '';

  get headerTitle(): string {
    const m: any = { board: 'Task Board', analytics: 'Analytics', todo: 'Todo Tasks', 'in-progress': 'In Progress', done: 'Completed' };
    return m[this.activeView] || 'Tasks';
  }

  constructor(private auth: AuthService, private taskService: TaskService) {}

  ngOnInit() {
    this.auth.user$.subscribe(u => this.user = u);
    if (this.auth.isLoggedIn() && !this.user) this.auth.fetchMe().subscribe();
  }

  openNewTask() { this.editingTask = null; this.modalVisible = true; }
  onEditTask(task: Task) { this.editingTask = task; this.modalVisible = true; }
  closeModal() { this.modalVisible = false; this.editingTask = null; }

  saveTask(data: Partial<Task>) {
    const obs = this.editingTask
      ? this.taskService.updateTask(this.editingTask.id, data)
      : this.taskService.createTask(data);
    obs.subscribe({ next: () => this.closeModal() });
  }
}
