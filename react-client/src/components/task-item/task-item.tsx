import cn from 'classnames';

import { memo, useMemo, type FC } from 'react';
import type { TaskItemProps } from './task-item.type';
import type { TaskStatus } from '../../store/types/task.type';

import styles from './task-item.module.css';

const STATUS_DICTIONARY: Record<TaskStatus, string> = {
  archived: 'В архиве',
  completed: 'Выполнено',
  in_progress: 'В процессе',
  pending: 'В очереди',
  failed: 'Ошибка',
};

export const TaskItem: FC<TaskItemProps> = memo(({ id, status, ...rest }) => {
  const classes = cn(rest.className, styles.task);

  const statusContent = useMemo(() => STATUS_DICTIONARY[status], [status]);

  return (
    <li {...rest} key={id} className={classes}>
      <p>{id}</p>
      <p className={styles[`taskStatus__${status}`]}>{statusContent}</p>
    </li>
  );
});
