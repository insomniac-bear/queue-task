import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SnakeToCamelKeys } from '../types/util.type';
import type { TaskMessage, TaskResponse } from '../types/task.type';
import { createEntityAdapter } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit';
import { add, change, initial, remove } from './statistic';

const taskAdapter = createEntityAdapter<TaskResponse>();

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost';
const WS_HOST = import.meta.env.VITE_WS_HOST || 'ws://localhost';
const PORT = import.meta.env.VITE_API_PORT || '3000';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_HOST}:${PORT}/tasks` }),
  endpoints: (builder) => ({
    getAllTasks: builder.query<EntityState<SnakeToCamelKeys<TaskResponse>, string>, void>({
      query: () => '/',

      transformResponse(response: SnakeToCamelKeys<TaskResponse>[]) {
        return taskAdapter.addMany(
          taskAdapter.getInitialState(),
          response
        )
      },

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          const tasks: SnakeToCamelKeys<TaskResponse>[] = [];
          for (const key in res.data.entities) {
            tasks.push(res.data.entities[key])
          }
          dispatch(initial({ total: res.data.ids.length, tasks }));
        });
      },

      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        const ws = new WebSocket(`${WS_HOST}:${PORT}/ws`);
        try {
          await cacheDataLoaded;

          const listener = (event: MessageEvent) => {
            const data: TaskMessage = JSON.parse(event.data);

            if (data.event === 'task_created' || data.event === 'task_updated') {
              updateCachedData((draft) => {
                if (data.event === 'task_created') {
                  dispatch(add({
                    newStatus: data.data.status,
                    previousStatus: null,
                  }))
                } else if (data.event === 'task_updated') {
                  const oldTask = draft.entities[data.data.id];
                  dispatch(change({
                    newStatus: data.data.status,
                    previousStatus: oldTask.status,
                  }))
                }

                taskAdapter.upsertOne(draft, data.data);
              });
            } else if (data.event === 'task_deleted') {
              updateCachedData((draft) => {
                const removedTask = draft.entities[data.data.id];
                dispatch(remove({ previousStatus: removedTask.status, newStatus: null }));
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
