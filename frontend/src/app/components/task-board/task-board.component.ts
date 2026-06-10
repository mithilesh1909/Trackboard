import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({ selector: 'app-task-board', templateUrl: './task-board.component.html', styleUrls: ['./task-board.component.scss'] })
export class TaskBoardComponent implements OnInit, OnDestroy {
  @Input() filterStatus = 'all';
  @Input() search = '';
  @Output() editTask = new EventEmitter<Task>();

  tasks: Task[] = [];
  private destroy$ = new Subject<void>();
  columns = [
    { id: 'todo', label: 'Todo', color: '#4a4e65' },
    { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
    { id: 'done', label: 'Done', color: '#22c55e' }
  ];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.tasks$.pipe(takeUntil(this.destroy$)).subscribe(t => this.tasks = t);
    this.taskService.loadTasks().subscribe();
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  getColumnTasks(status: string): Task[] {
    let filtered = this.tasks.filter(t => t.status === status);
    if (this.filterStatus !== 'all' && this.filterStatus !== status) return [];
    if (this.search) filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(this.search.toLowerCase()) ||
      t.description.toLowerCase().includes(this.search.toLowerCase())
    );
    return filtered;
  }

  onStatusChange(e: { id: string; status: string }) {
    this.taskService.updateTask(e.id, { status: e.status as any }).subscribe();
  }

  onDelete(id: string) {
    if (confirm('Delete this task?')) this.taskService.deleteTask(id).subscribe();
  }

  trackById(_: number, t: Task) { return t.id; }
}
