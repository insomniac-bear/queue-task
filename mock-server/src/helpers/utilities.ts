import type { TaskStatus } from '../types/statuses.type';
import type { Task } from '../types/task.type';
import { STATUSES } from './const';

export const randomStatus = (): TaskStatus => {
  const idx = Math.floor(Math.random() * STATUSES.length);
  return STATUSES[idx];
}

export const createTask = (id?: string | number): Task => {
  const taskId = id !== undefined
    ? String(id)
    : String(Date.now() + Math.floor(Math.random() * 1000));

  return {
    id: taskId,
    status: randomStatus(),
  }
}

export const initTasks = (count: number, inMemoryTasks: Map<string, Task>): Map<string, Task> => {
  for (let i = 0; i < count; i++) {
    inMemoryTasks.set(String(i), createTask(i));
  }

  return inMemoryTasks
}
