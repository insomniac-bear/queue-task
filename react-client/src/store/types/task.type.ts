export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'archived' | 'failed';

export interface TaskResponse {
  id: string;
  status: TaskStatus;
}

export interface TaskMessage {
  event: 'task_created' | 'task_updated' | 'task_deleted';
  data: TaskResponse;
}