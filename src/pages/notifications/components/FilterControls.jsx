import React from 'react';
import Button from '../../../components/ui/Button';

const FilterControls = ({ value = 'all', onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant={value === 'all' ? 'default' : 'outline'} size="sm" onClick={() => onChange?.('all')}>All</Button>
      <Button variant={value === 'unread' ? 'default' : 'outline'} size="sm" onClick={() => onChange?.('unread')}>Unread</Button>
    </div>
  );
};

export default FilterControls;
