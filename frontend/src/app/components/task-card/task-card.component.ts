import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({ selector: 'app-task-card', templateUrl: './task-card.component.html', styleUrls: ['./task-card.component.scss'] })
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{ id: string; status: string }>();

  isOverdue(): boolean {
    if (this.task.status === 'done') return false;
    return this.task.due_date < new Date().toISOString().split('T')[0];
  }

  getDaysLeft(): string {
    const diff = new Date(this.task.due_date).getTime() - Date.now();
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return 'Due today';
    return `${days}d left`;
  }

  nextStatus() {
    const map: any = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };
    this.statusChange.emit({ id: this.task.id, status: map[this.task.status] });
  }
}
