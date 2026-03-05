import cn from 'classnames';
import { Suspense } from 'react';
import { useOutletContext } from 'react-router';
import { TaskItem } from '../task-item/task-item';

import type { FC, HTMLProps } from 'react';
import type { OutletContextType } from '../../pages/layout';
import styles from './task-list.module.css';

export const TaskList: FC<HTMLProps<HTMLUListElement>> = ({
  className,
  ...rest
}) => {
  const classes = cn(styles.taskList, className);
  const { data, error, isLoading } = useOutletContext<OutletContextType>();

  return (
    <ul className={classes} {...rest}>
      <Suspense fallback={isLoading && <li>Loading...</li>}>
        {data &&
          data.ids.map((id) => (
            <TaskItem key={id} id={id} status={data.entities[id].status} />
          ))}
      </Suspense>
      {error && <li>Произошла ошибка во время загрузки данных</li>}
    </ul>
  );
};
