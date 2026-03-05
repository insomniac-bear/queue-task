import { Outlet } from 'react-router';
import { Navigation } from '../components/navigation/navigation';
import { useGetAllTasksQuery } from '../store/services/tasks';
import type { FC } from 'react';
import type { SnakeToCamelKeys } from '../store/types/util.type';
import type { EntityState, SerializedError } from '@reduxjs/toolkit';
import type { TaskResponse } from '../store/types/task.type';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export type OutletContextType = {
  data: EntityState<SnakeToCamelKeys<TaskResponse>, string> | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
};

export const Layout: FC = () => {
  const { data, error, isLoading } = useGetAllTasksQuery();

  return (
    <>
      <header className="header">
        <Navigation />
      </header>
      <main className="main">
        <Outlet context={{ data, error, isLoading }} />
      </main>
    </>
  );
};
