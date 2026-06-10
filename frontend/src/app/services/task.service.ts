import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task, Analytics } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private API = 'http://localhost:8000/api';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadTasks(filters?: any): Observable<Task[]> {
    let params = new HttpParams();
    if (filters) Object.keys(filters).forEach(k => { if (filters[k]) params = params.set(k, filters[k]); });
    return this.http.get<Task[]>(`${this.API}/tasks`, { params }).pipe(
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.API}/tasks`, task).pipe(
      tap(t => this.tasksSubject.next([t, ...this.tasksSubject.value]))
    );
  }

  updateTask(id: string, updates: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.API}/tasks/${id}`, updates).pipe(
      tap(updated => this.tasksSubject.next(this.tasksSubject.value.map(t => t.id === id ? updated : t)))
    );
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.API}/tasks/${id}`).pipe(
      tap(() => this.tasksSubject.next(this.tasksSubject.value.filter(t => t.id !== id)))
    );
  }

  getAnalytics(): Observable<Analytics> {
    return this.http.get<Analytics>(`${this.API}/analytics`);
  }
}
