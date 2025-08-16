import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
