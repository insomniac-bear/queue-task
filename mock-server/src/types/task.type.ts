import type { TaskStatus } from './statuses.type';

export interface Task {
  id: string;
  status: TaskStatus
}