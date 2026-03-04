import { STATUSES } from '../helpers/const';
import { createTask, randomStatus } from '../helpers/utilities';

import type { Task } from '../types/task.type';
import type { WebsocketClient } from '../types/ws.type';
import type { TaskStatus } from '../types/statuses.type';

export class TaskService {
  private tasks: Map<string, Task>;
  private clients: Set<WebsocketClient>;
  private interval: NodeJS.Timeout | null = null;

  constructor(tasks: Map<string, Task>) {
    this.tasks = tasks;
    this.clients = new Set()
    this.startSimulation();
  }

  private broadcast(event: string, data: unknown): void {
    const message = JSON.stringify({ event, data });
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
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

  public addClient(client: WebsocketClient): void {
    this.clients.add(client);
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: 'init', data: this.getAllTasks() }));
    }
  }

  public removeClient(client: WebsocketClient): void {
    this.clients.delete(client);
  }

  public getClientCount(): number {
    return this.clients.size;
  }
}