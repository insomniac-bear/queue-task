import cn from 'classnames';

import type { FC, HTMLProps } from 'react';
import styles from './task-list.module.css';

export const TaskList: FC<HTMLProps<HTMLUListElement>> = ({
  children,
  className,
  ...rest
}) => {
  const classes = cn(styles.taskList, className);

  return (
    <ul className={classes} {...rest}>
      {children}
    </ul>
  );
};
