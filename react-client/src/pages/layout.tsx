import { Outlet } from 'react-router';
import { Navigation } from '../components/navigation/navigation';
import type { FC } from 'react';

export const Layout: FC = () => {
  return (
    <>
      <header className="header">
        <Navigation />
      </header>
      <main className="main">
        <Outlet />
      </main>
    </>
  );
};
