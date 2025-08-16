import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const typeStyles = {
  info: {
    icon: 'Info',
    iconClass: 'text-accent',
    badgeClass: 'bg-accent text-accent-foreground',
  },
  success: {
    icon: 'CheckCircle2',
    iconClass: 'text-success',
    badgeClass: 'bg-success text-success-foreground',
  },
  warning: {
    icon: 'AlertTriangle',
    iconClass: 'text-warning',
    badgeClass: 'bg-warning text-warning-foreground',
  },
  error: {
    icon: 'XCircle',
    iconClass: 'text-error',
    badgeClass: 'bg-error text-error-foreground',
  },
};

const NotificationCard = ({ notification, onMarkRead }) => {
  const { id, title, description, timestamp, type = 'info', read = false, cta } = notification;
  const t = typeStyles[type] || typeStyles.info;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border border-border bg-card text-card-foreground shadow-medical-card ${!read ? 'ring-1 ring-primary/20' : ''}`}>
      <div className={`mt-0.5`}>
        <Icon name={t.icon} size={18} className={t.iconClass} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-foreground truncate">{title}</h3>
          <span className="shrink-0 text-xs text-muted-foreground">{new Date(timestamp).toLocaleString()}</span>
        </div>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        <div className="mt-3 flex items-center gap-2">
          {!read && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${t.badgeClass}`}>New</span>
          )}
          {cta?.label && (
            <Button size="sm" variant={cta.variant || 'outline'} onClick={cta.onClick}>{cta.label}</Button>
          )}
          {!read && (
            <Button size="sm" variant="ghost" onClick={() => onMarkRead?.(id)}>Mark as read</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
