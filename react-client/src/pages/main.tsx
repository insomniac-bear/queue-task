import { TaskList } from '../components/task-list/task-list';
import { Title } from '../components/title/title';
import type { FC } from 'react';

export const Main: FC = () => (
  <>
    <Title>Список задач</Title>
    <TaskList />
  </>
);
