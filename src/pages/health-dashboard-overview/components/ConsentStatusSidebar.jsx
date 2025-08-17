import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConsentStatusSidebar = ({ 
  approvedProviders, 
  activeSharingLinks, 
  onRevokeProvider, 
  onRevokeLink,
  onManageConsent 
}) => {
  const [expandedProvider, setExpandedProvider] = useState(null);

  const formatExpiryDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffInDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Expired';
    if (diffInDays === 0) return 'Expires today';
    if (diffInDays === 1) return 'Expires tomorrow';
    if (diffInDays <= 7) return `${diffInDays} days left`;
    return `${Math.ceil(diffInDays / 7)} weeks left`;
  };

  const ProviderCard = ({ provider }) => {
    const isExpanded = expandedProvider === provider?.id;
    const timeRemaining = getTimeRemaining(provider?.expiryDate);
    const isExpiringSoon = new Date(provider.expiryDate) - new Date() < 7 * 24 * 60 * 60 * 1000;

    return (
      <div className="p-4 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="User" size={16} className="text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-card-foreground">{provider?.name}</h4>
              <p className="text-xs text-muted-foreground">{provider?.specialty}</p>
            </div>
          </div>
          <button
            onClick={() => setExpandedProvider(isExpanded ? null : provider?.id)}
            className="p-1 rounded hover:bg-muted transition-clinical"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className={`px-2 py-1 rounded-full text-xs ${
            isExpiringSoon 
              ? 'bg-clinical-amber/10 text-clinical-amber' :'bg-clinical-green/10 text-clinical-green'
          }`}>
            {timeRemaining}
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-clinical-green rounded-full" />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
        </div>
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Access Level</p>
              <div className="flex flex-wrap gap-1">
                {provider?.permissions?.map((permission, index) => (
                  <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Granted On</p>
              <p className="text-xs text-card-foreground">{formatExpiryDate(provider?.grantedDate)}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onRevokeProvider(provider?.id)}
              iconName="X"
              iconPosition="left"
              className="w-full"
            >
              Revoke Access
            </Button>
          </div>
        )}
      </div>
    );
  };

  const SharingLinkCard = ({ link }) => {
    const timeRemaining = getTimeRemaining(link?.expiryDate);
    const isExpiringSoon = new Date(link.expiryDate) - new Date() < 24 * 60 * 60 * 1000;

    return (
      <div className="p-4 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Link" size={16} className="text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-card-foreground">{link?.name}</h4>
              <p className="text-xs text-muted-foreground">Shared link</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className={`px-2 py-1 rounded-full text-xs ${
            isExpiringSoon 
              ? 'bg-clinical-amber/10 text-clinical-amber' :'bg-clinical-green/10 text-clinical-green'
          }`}>
            {timeRemaining}
          </div>
          <span className="text-xs text-muted-foreground">{link?.accessCount} views</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard?.writeText(link?.url)}
            iconName="Copy"
            iconPosition="left"
            className="flex-1"
          >
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRevokeLink(link?.id)}
            iconName="X"
            iconPosition="left"
            className="flex-1"
          >
            Revoke
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Approved Providers */}
      <div className="bg-card rounded-lg border border-border shadow-medical-card">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-clinical-green/10 rounded-lg">
              <Icon name="Shield" size={20} className="text-clinical-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Approved Providers</h3>
              <p className="text-sm text-muted-foreground">{approvedProviders?.length} active consents</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onManageConsent}
            iconName="Settings"
            iconPosition="left"
          >
            Manage
          </Button>
        </div>

        <div className="p-6">
          {approvedProviders?.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center w-16 h-16 bg-muted/50 rounded-lg mx-auto mb-4">
                <Icon name="Shield" size={24} className="text-muted-foreground" />
              </div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">No Active Consents</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Grant access to healthcare providers to view your records
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onManageConsent}
                iconName="Plus"
                iconPosition="left"
              >
                Grant Access
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {approvedProviders?.map((provider) => (
                <ProviderCard key={provider?.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Active Sharing Links */}
      <div className="bg-card rounded-lg border border-border shadow-medical-card">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
              <Icon name="Link" size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Sharing Links</h3>
              <p className="text-sm text-muted-foreground">{activeSharingLinks?.length} active links</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {activeSharingLinks?.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center w-16 h-16 bg-muted/50 rounded-lg mx-auto mb-4">
                <Icon name="Link" size={24} className="text-muted-foreground" />
              </div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">No Active Links</h4>
              <p className="text-sm text-muted-foreground">
                Create secure sharing links for temporary access
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeSharingLinks?.map((link) => (
                <SharingLinkCard key={link?.id} link={link} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsentStatusSidebar;