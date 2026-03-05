import { createSlice } from '@reduxjs/toolkit';

import type { TaskResponse, TaskStatus } from '../types/task.type';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SnakeToCamelKeys } from '../types/util.type';
import type { RootState } from '../store';

export type StatisticState = Record<TaskStatus | 'total', number>;

type ChangePayloadType = {
  previousStatus: TaskStatus | null;
  newStatus: TaskStatus | null;
}

type InitialPayloadType = {
  total: number;
  tasks: SnakeToCamelKeys<TaskResponse>[];
}

const initialState: StatisticState = {
  total: 0,
  archived: 0,
  completed: 0,
  failed: 0,
  in_progress: 0,
  pending: 0,
}

export const statisticSlice = createSlice({
  name: 'statistic',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ChangePayloadType>) => {
      const prevStatus = action.payload.previousStatus;
      const newStatus = action.payload.newStatus;
      if (prevStatus !== null) state[prevStatus] -= 1;
      if (newStatus !== null) state[newStatus] += 1;
    },

    initial: (state, action: PayloadAction<InitialPayloadType>) => {
      state.total = action.payload.total;
      action.payload.tasks.forEach(task => state[task.status] += 1);
    },

    add: (state, action: PayloadAction<ChangePayloadType>) => {
      const addingStatus = action.payload.newStatus;
      state.total += 1;
      if (addingStatus) state[addingStatus] += 1;
    },

    remove: (state, action: PayloadAction<ChangePayloadType>) => {
      const removedStatus = action.payload.previousStatus;
      state.total -= 1;
      if (removedStatus) state[removedStatus] += 1;
    },
  },
});

export const { add, change, initial, remove } = statisticSlice.actions;

export const selectTotal = (state: RootState) => state.statistic.total;
export const selectArchived = (state: RootState) => state.statistic.archived;
export const selectCompleted = (state: RootState) => state.statistic.completed;
export const selectFailed = (state: RootState) => state.statistic.failed;
export const selectInProgress = (state: RootState) => state.statistic.in_progress;
export const selectPending = (state: RootState) => state.statistic.pending;

export default statisticSlice.reducer;
