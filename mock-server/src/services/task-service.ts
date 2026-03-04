import { STATUSES } from '../helpers/const';
import { createTask, randomStatus } from '../helpers/utilities';

import type { Task } from '../types/task.type';
import type { SseClient } from '../types/sse-client.type';
import type { TaskStatus } from '../types/statuses.type';

export class TaskService {
  private tasks: Map<string, Task>;
  private clients: SseClient[];
  private interval: NodeJS.Timeout | null = null;

  constructor(tasks: Map<string, Task>) {
    this.tasks = tasks;
    this.clients = [];
    this.startSimulation();
  }

  private broadcast(event: string, data: unknown): void {
    this.clients.forEach(client => {
      client.res.write(`event: ${event}\n`);
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }

  private simulateChanges(): void {
    const action = Math.random();

    if (action < 0.4) {
      const task = createTask();
      this.tasks.set(task.id, task);
      this.broadcast('create', task);
      console.log('Создана задача:', task);
    } else if (action < 0.8 && this.tasks.size > 0) {
      const ids = Array.from(this.tasks.keys());
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      const task = this.tasks.get(randomId)!;
      let newStatus: TaskStatus;
      do {
        newStatus = randomStatus();
      } while (newStatus === task.status && STATUSES.length > 1);
      task.status = newStatus;
      this.tasks.set(randomId, task);
      this.broadcast('update', task);
      console.log('Обновлена задача:', task);
    } else if (this.tasks.size > 0) {
      const ids = Array.from(this.tasks.keys());
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      this.tasks.delete(randomId);
      this.broadcast('delete', { id: randomId });
      console.log('Удалена задача с id:', randomId);
    }
  }

  private startSimulation(intervalMs: number = 5000): void {
    this.interval = setInterval(() => this.simulateChanges(), intervalMs);
  }

  public stopSimulation(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  public getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  public getTaskById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  public addClient(client: SseClient): void {
    this.clients.push(client);
  }

  public removeClient(clientId: number): void {
    this.clients = this.clients.filter(c => c.id !== clientId);
  }

  public sendInitData(res: any): void {
    const initialData = this.getAllTasks();
    res.write(`event: init\n`);
    res.write(`data: ${JSON.stringify(initialData)}\n\n`);
  }

  public getClientCount(): number {
    return this.clients.length;
  }
}