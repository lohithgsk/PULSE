import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ShareModal = ({ record, isOpen, onClose, onShare }) => {
  const [shareMethod, setShareMethod] = useState('link');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [accessDuration, setAccessDuration] = useState('24');
  const [accessLevel, setAccessLevel] = useState('view');
  const [isSharing, setIsSharing] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const shareMethodOptions = [
    { value: 'link', label: 'Secure Access Link' },
    { value: 'nft', label: 'NFT Consent Token' },
    { value: 'email', label: 'Email Invitation' }
  ];

  const durationOptions = [
    { value: '1', label: '1 Hour' },
    { value: '24', label: '24 Hours' },
    { value: '168', label: '1 Week' },
    { value: '720', label: '1 Month' },
    { value: 'custom', label: 'Custom Duration' }
  ];

  const accessLevelOptions = [
    { value: 'view', label: 'View Only' },
    { value: 'download', label: 'View & Download' },
    { value: 'full', label: 'Full Access' }
  ];

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareData = {
        recordId: record?.id,
        method: shareMethod,
        recipientEmail: shareMethod === 'email' ? recipientEmail : null,
        duration: accessDuration,
        accessLevel: accessLevel
      };
      
      const result = await onShare(shareData);
      if (result?.link) {
        setGeneratedLink(result?.link);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-popover rounded-lg shadow-medical-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <Icon name="Share" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-popover-foreground">Share Medical Record</h3>
              <p className="text-sm text-muted-foreground">{record?.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!generatedLink ? (
            <>
              {/* Share Method */}
              <Select
                label="Sharing Method"
                description="Choose how you want to share this record"
                options={shareMethodOptions}
                value={shareMethod}
                onChange={setShareMethod}
              />

              {/* Recipient Email (for email method) */}
              {shareMethod === 'email' && (
                <Input
                  type="email"
                  label="Recipient Email"
                  placeholder="doctor@hospital.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e?.target?.value)}
                  required
                />
              )}

              {/* Access Duration */}
              <Select
                label="Access Duration"
                description="How long should the recipient have access?"
                options={durationOptions}
                value={accessDuration}
                onChange={setAccessDuration}
              />

              {/* Access Level */}
              <Select
                label="Access Level"
                description="What permissions should the recipient have?"
                options={accessLevelOptions}
                value={accessLevel}
                onChange={setAccessLevel}
              />

              {/* Security Information */}
              <div className="p-4 rounded-lg bg-clinical-green/10 border border-clinical-green/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Shield" size={16} className="text-clinical-green" />
                  <span className="text-sm font-medium text-clinical-green">Security Features</span>
                </div>
                <ul className="text-xs text-clinical-green/80 space-y-1">
                  <li>• End-to-end encryption protects your data</li>
                  <li>• Access automatically expires after set duration</li>
                  <li>• All access attempts are logged on blockchain</li>
                  <li>• You can revoke access at any time</li>
                </ul>
              </div>

              {/* Method-specific Information */}
              {shareMethod === 'link' && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Link" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-primary">Secure Link Sharing</span>
                  </div>
                  <p className="text-xs text-primary/80">
                    A unique, encrypted link will be generated that can be shared with healthcare providers. The link expires automatically.
                  </p>
                </div>
              )}

              {shareMethod === 'nft' && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Coins" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-primary">NFT Consent Token</span>
                  </div>
                  <p className="text-xs text-primary/80">
                    Creates a blockchain-based consent token that provides verifiable, time-limited access to your medical record.
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Generated Link Display */
            (<div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-clinical-green/10 rounded-full mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-clinical-green" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">Share Link Generated</h4>
                <p className="text-sm text-muted-foreground">
                  Your secure access link has been created and is ready to share.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Secure Access Link</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedLink)}
                    iconName="Copy"
                    iconPosition="left"
                  >
                    Copy
                  </Button>
                </div>
                <div className="p-3 rounded bg-background border border-border">
                  <p className="text-xs font-mono text-foreground break-all">{generatedLink}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Expires In</p>
                  <p className="text-sm font-medium text-foreground">{accessDuration} hours</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Access Level</p>
                  <p className="text-sm font-medium text-foreground capitalize">{accessLevel}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-clinical-amber/10 border border-clinical-amber/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="AlertTriangle" size={16} className="text-clinical-amber" />
                  <span className="text-sm font-medium text-clinical-amber">Important</span>
                </div>
                <p className="text-xs text-clinical-amber/80">
                  This link provides access to sensitive medical information. Only share it with trusted healthcare providers.
                </p>
              </div>
            </div>)
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            {generatedLink ? 'Done' : 'Cancel'}
          </Button>
          {!generatedLink && (
            <Button
              onClick={handleShare}
              loading={isSharing}
              iconName="Share"
              iconPosition="left"
              disabled={shareMethod === 'email' && !recipientEmail}
            >
              Generate Share Link
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;