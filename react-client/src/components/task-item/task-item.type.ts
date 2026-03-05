import type { HTMLProps } from 'react';
import type { TaskStatus } from '../../store/types/task.type';

export interface TaskItemProps extends HTMLProps<HTMLLIElement> {
  id: string;
  status: TaskStatus;
}