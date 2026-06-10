export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  due_date: string;        // Python API uses snake_case
  assignee_id: string;
  created_at: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Analytics {
  total: number;
  todo: number;
  in_progress: number;
  done: number;
  overdue: number;
  high_priority: number;
  by_category: { [key: string]: number };
  completion_rate: number;
}
