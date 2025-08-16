import React, { useState } from 'react';
import FilterControls from './components/FilterControls';
import NotificationList from './components/NotificationList';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
      <FilterControls value={filter} onChange={setFilter} />
      <NotificationList filter={filter} />
    </div>
  );
};

export default NotificationsPage;
