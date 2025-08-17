import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Skeleton from '../../../components/ui/Skeleton';

const QuickActionCards = ({ onEmergencyAccess, isLoading = false }) => {
  const quickActions = [
    {
      id: 'grant-consent',
      title: 'Grant Access',
      description: 'Allow healthcare providers to view your records',
      icon: 'Shield',
      color: 'text-clinical-green',
      bg: 'bg-clinical-green/10',
      border: 'border-clinical-green/20',
      path: '/consent-access-management'
    },
    {
      id: 'view-records',
      title: 'View Records',
      description: 'Access your complete medical history',
      icon: 'FileText',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      path: '/medical-records-management'
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Get health insights and ask medical questions',
      icon: 'Brain',
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/20',
      path: '/ai-health-assistant-analysis'
    },
    {
      id: 'emergency-contacts',
      title: 'Emergency Access',
      description: 'Configure emergency contacts and break glass access',
      icon: 'AlertTriangle',
      color: 'text-clinical-amber',
      bg: 'bg-clinical-amber/10',
      border: 'border-clinical-amber/20',
      path: '/emergency-access-contacts',
      onClick: onEmergencyAccess
    }
  ];

  const ActionCard = ({ action }) => {
    const CardContent = () => (
      <div className={`p-6 rounded-lg border ${action?.border} ${action?.bg} hover:bg-opacity-80 transition-clinical cursor-pointer group`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${action?.bg} border ${action?.border}`}>
            <Icon name={action?.icon} size={24} className={action?.color} />
          </div>
          <Icon name="ArrowRight" size={16} className="text-muted-foreground group-hover:text-foreground transition-clinical" />
        </div>
        
        <h3 className="text-lg font-semibold text-card-foreground mb-2">{action?.title}</h3>
        <p className="text-sm text-muted-foreground">{action?.description}</p>
      </div>
    );

    if (action?.onClick) {
      return (
        <button onClick={action?.onClick} className="w-full text-left">
          <CardContent />
        </button>
      );
    }

    return (
      <Link to={action?.path}>
        <CardContent />
      </Link>
    );
  };

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="p-4 sm:p-6 rounded-lg border border-border bg-muted/50">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-4 w-6" />
              </div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))
        : quickActions?.map((action) => (
            <ActionCard key={action?.id} action={action} />
          ))}
    </div>
  );
};

export default QuickActionCards;