import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

export default Skeleton;
