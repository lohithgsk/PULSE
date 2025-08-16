import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-6 md:py-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
