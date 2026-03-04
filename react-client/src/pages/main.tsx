import type { FC } from 'react';
import { useGetAllTasksQuery } from '../store/services/tasks';

export const Main: FC = () => {
  const { data, error, isLoading } = useGetAllTasksQuery();

  return (
    <div>
      <h1>Список задач</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Произошла ошибка во время загрузки данных</p>}
      {data && (
        <>
          <p>Всего задач: {data.ids.length}</p>
          <ul>
            {data.ids.map((id) => (
              <li key={id}>
                {data.entities[id].id} {data.entities[id].status}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
