import type { FC } from 'react';
import { useGetAllTasksQuery } from '../store/services/tasks';
import { TaskItem } from '../components/task-item/task-item';
import { TaskList } from '../components/task-list/task-list';
import { Title } from '../components/title/title';

export const Main: FC = () => {
  const { data, error, isLoading } = useGetAllTasksQuery();

  return (
    <>
      <Title>Список задач</Title>
      {isLoading && <p>Loading...</p>}
      {error && <p>Произошла ошибка во время загрузки данных</p>}
      {data && (
        <>
          <p>Всего задач: {data.ids.length}</p>
          <TaskList>
            {data.ids.map((id) => (
              <TaskItem key={id} id={id} status={data.entities[id].status} />
            ))}
          </TaskList>
        </>
      )}
    </>
  );
};
