import { Router } from 'express';
import { TaskService } from '../services/task-service';

import type { Request, Response } from 'express';
import type { ParamsDictionary } from '../types/routes.type';

export function createTaskRouter(taskService: TaskService): Router {
  const router = Router();

  /**
   * GET /tasks
   * @summary Получить все задачи
   */
  router.get('/', (_req: Request, res: Response) => {
    const tasks = taskService.getAllTasks();
    res.json(tasks);
  });

  /**
   * GET /tasks/:id
   * @summary Получить задачу по id
   */
  router.get('/:id', (req: Request<ParamsDictionary>, res: Response) => {
    const { id } = req.params;
    const task = taskService.getTaskById(id);

    if (!task) {
      res.status(404).json({ message: 'Задача не найдена' });
    } else {
      res.json(task);
    }
  });

  return router;
}
