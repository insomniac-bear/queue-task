import { createBrowserRouter } from 'react-router';
import { Main } from '../pages/main';
import { Layout } from '../pages/layout';
import { Statistics } from '../pages/statistics';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/statistics',
        element: <Statistics />,
      },
    ],
  },
]);
