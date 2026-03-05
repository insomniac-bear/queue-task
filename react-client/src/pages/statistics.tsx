import { useEffect, useRef } from 'react';
import { init } from 'echarts';
import { Title } from '../components/title/title';
import { useAppSelector } from '../store/store-hooks';
import {
  selectArchived,
  selectCompleted,
  selectFailed,
  selectInProgress,
  selectPending,
  selectTotal,
} from '../store/services/statistic';

import type { FC } from 'react';
import type { EChartsOption } from 'echarts';

export const Statistics: FC = () => {
  const chartRef = useRef(null);
  const total = useAppSelector(selectTotal);
  const pending = useAppSelector(selectPending);
  const inProgress = useAppSelector(selectInProgress);
  const completed = useAppSelector(selectCompleted);
  const failed = useAppSelector(selectFailed);
  const archived = useAppSelector(selectArchived);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = init(chartRef.current);
    const pieData = [
      { name: 'В очереди', value: pending },
      { name: 'В процессе', value: inProgress },
      { name: 'Выполнено', value: completed },
      { name: 'Ошибка', value: failed },
      { name: 'В архиве', value: archived },
    ];

    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          name: 'Задачи',
          type: 'pie',
          radius: '50%',
          data: pieData,
          emphasis: {
            itemStyle: {
              color: '#ccc',
            },
          },
        },
      ],
    };

    chart.setOption(option);
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [pending, inProgress, completed, failed, archived]);
  return (
    <>
      <Title>Статистика по задачам</Title>
      <ul>
        <li>Всего задач: {total}</li>
        <li>В очереди: {pending}</li>
        <li>В процессе: {inProgress}</li>
        <li>Выполнено: {completed}</li>
        <li>Ошибка: {failed}</li>
        <li>В архиве: {archived}</li>
      </ul>
      <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
    </>
  );
};
