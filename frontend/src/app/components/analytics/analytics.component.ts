import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Analytics } from '../../models/task.model';

@Component({ selector: 'app-analytics', templateUrl: './analytics.component.html', styleUrls: ['./analytics.component.scss'] })
export class AnalyticsComponent implements OnInit {
  analytics: Analytics | null = null;
  loading = true;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getAnalytics().subscribe({
      next: data => { this.analytics = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  getCategoryEntries(): { key: string; val: number }[] {
    if (!this.analytics) return [];
    return Object.entries(this.analytics.by_category).map(([key, val]) => ({ key, val }));
  }

  getBarWidth(val: number): number {
    if (!this.analytics) return 0;
    const max = Math.max(...Object.values(this.analytics.by_category));
    return max > 0 ? (val / max) * 100 : 0;
  }

  getArc(value: number): string {
    const r = 54; const c = 2 * Math.PI * r;
    return `${(value / 100) * c} ${c - (value / 100) * c}`;
  }
}
