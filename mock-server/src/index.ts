import express from 'express';
import cors from 'cors';
import type { Task } from './types/task.type';
import { initTasks } from './helpers/utilities';
import { TaskService } from './services/task-service';
import { createTaskRouter } from './routes/task-routes';

const app = express();
const PORT = process.env.PORT || 3000;
const TASKS_COUNT = Number(process.env.TASKS_COUNT) || 10;
const tasks = new Map<string, Task>();
initTasks(TASKS_COUNT, tasks);
const taskService = new TaskService(tasks);

app.use(cors());
app.use(express.json());
app.use('/tasks', createTaskRouter(taskService));

const shutdown = () => {
  console.log('Shutting down...');
  taskService.stopSimulation();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGINT', shutdown);

app.listen(PORT, () => {
  console.log(`Мок аггрегатор запущен на порту ${PORT}`);
})