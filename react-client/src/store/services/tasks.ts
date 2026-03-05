import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SnakeToCamelKeys } from '../types/util.type';
import type { TaskMessage, TaskResponse } from '../types/task.type';
import { createEntityAdapter } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit';

const taskAdapter = createEntityAdapter<TaskResponse>();

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/tasks' }),
  endpoints: (builder) => ({
    getAllTasks: builder.query<EntityState<SnakeToCamelKeys<TaskResponse>, string>, void>({
      query: () => '/',
      transformResponse(response: SnakeToCamelKeys<TaskResponse>[]) {
        return taskAdapter.addMany(
          taskAdapter.getInitialState(),
          response
        )
      },
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const ws = new WebSocket('ws://localhost:3000/ws');
        try {
          await cacheDataLoaded;

          const listener = (event: MessageEvent) => {
            const data: TaskMessage = JSON.parse(event.data);

            if (data.event === 'task_created' || data.event === 'task_updated') {
              updateCachedData((draft) => {
                taskAdapter.upsertOne(draft, data.data);
              });
            } else if (data.event === 'task_deleted') {
              updateCachedData((draft) => {
                taskAdapter.removeOne(draft, data.data.id);
              });
            }
          }
          ws.addEventListener('message', listener);
        } catch (error) {
          console.error(error);
        }
        await cacheEntryRemoved;
        ws.close();
      }
    }),

    getTaskById: builder.query<SnakeToCamelKeys<TaskResponse>, string>({
      query: (id) => `/${id}`,
    }),
  }),
});

export const { useGetAllTasksQuery, useGetTaskByIdQuery } = tasksApi;