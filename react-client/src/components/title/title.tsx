import cn from 'classnames';
import type { FC, HTMLProps } from 'react';
import styles from './title.module.css';

export const Title: FC<HTMLProps<HTMLHeadingElement>> = ({
  className,
  children,
  ...rest
}) => {
  const classes = cn(styles.title, className);

  return (
    <h1 className={classes} {...rest}>
      {children}
    </h1>
  );
};
