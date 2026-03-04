import type { Response } from 'express';

export interface SseClient {
  id: number;
  res: Response
}
