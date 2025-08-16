import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { blockchainService } from '../../utils/blockchainService';
import { useI18n } from '../../i18n/I18nProvider';

import WalletSelector from './components/WalletSelector';
import SecurityFeatures from './components/SecurityFeatures';
import NetworkStatus from './components/NetworkStatus';
import ConnectedWalletInfo from './components/ConnectedWalletInfo';
import TrustIndicators from './components/TrustIndicators';

const WalletConnectionAuthentication = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [connectionState, setConnectionState] = useState('disconnected'); // disconnected, connecting, connected
  const [error, setError] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState('Sepolia');
  const [networkStatus, setNetworkStatus] = useState('connected');
  const [walletInfo, setWalletInfo] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Real wallet connection using blockchain service
  const handleWalletSelect = async (walletData) => {
    setConnectionState('connecting');
    setError(null);

    try {
      let walletInfo;
      
      if (typeof walletData === 'string') {
        // Legacy wallet ID handling for non-MetaMask wallets
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        walletInfo = {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          type: walletData === 'metamask' ? 'MetaMask' : 
                walletData === 'walletconnect' ? 'WalletConnect' :
                walletData === 'coinbase' ? 'Coinbase Wallet' : 'Trust Wallet',
          did: 'did:ethr:0x1234567890abcdef1234567890abcdef12345678',
          balance: '0.0523',
          network: 'Sepolia',
          chainId: '11155111'
        };
      } else {
        // Real wallet info from blockchain service
        walletInfo = walletData;
      }

      setWalletInfo(walletInfo);
      setConnectionState('connected');
      setCurrentNetwork(walletInfo?.network || 'Sepolia');
      
      // Store connection state in localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletInfo', JSON.stringify(walletInfo));
      
    } catch (err) {
      setError(err?.message || 'Failed to connect wallet. Please try again.');
      setConnectionState('disconnected');
    }
  };

  const handleDisconnect = async () => {
    try {
      await blockchainService?.disconnectWallet();
      setConnectionState('disconnected');
      setWalletInfo(null);
      setError(null);
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletInfo');
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handleNavigateToDashboard = () => {
    navigate('/health-dashboard-overview');
  };

  const handleNetworkSwitch = async () => {
    try {
      if (currentNetwork !== 'Sepolia') {
        const success = await blockchainService?.switchToSepolia();
        if (success) {
          setCurrentNetwork('Sepolia');
          setNetworkStatus('connected');
        } else {
      setError(t('auth.errors.switchToSepoliaFailed'));
        }
      }
    } catch (error) {
    setError(t('auth.errors.networkSwitchFailed') + ': ' + (error?.message || ''));
    }
  };

  // Check for existing connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const savedConnection = localStorage.getItem('walletConnected');
      const savedWalletInfo = localStorage.getItem('walletInfo');
      
      if (savedConnection === 'true' && savedWalletInfo) {
        try {
          const parsedWalletInfo = JSON.parse(savedWalletInfo);
          
          // Try to verify the connection is still active
          if (typeof window?.ethereum !== 'undefined') {
            try {
              const accounts = await window.ethereum?.request({ method: 'eth_accounts' });
              if (accounts?.length > 0 && accounts?.[0]?.toLowerCase() === parsedWalletInfo?.address?.toLowerCase()) {
                // Connection is still active
                const networkStatus = await blockchainService?.getNetworkStatus();
                setWalletInfo(parsedWalletInfo);
                setConnectionState('connected');
                setCurrentNetwork(networkStatus?.name || 'Sepolia');
                setNetworkStatus(networkStatus?.connected ? 'connected' : 'disconnected');
                return;
              }
            } catch (error) {
              console.error('Connection verification failed:', error);
            }
          }
          
          // Fallback to saved info if verification fails
          setWalletInfo(parsedWalletInfo);
          setConnectionState('connected');
        } catch (err) {
          console.error('Failed to parse saved wallet info:', err);
          localStorage.removeItem('walletConnected');
          localStorage.removeItem('walletInfo');
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window?.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts?.length === 0) {
          handleDisconnect();
        } else if (walletInfo && accounts?.[0]?.toLowerCase() !== walletInfo?.address?.toLowerCase()) {
          // Account changed, update wallet info
          const updatedWalletInfo = {
            ...walletInfo,
            address: accounts?.[0],
            did: `did:ethr:${accounts?.[0]}`
          };
          setWalletInfo(updatedWalletInfo);
          localStorage.setItem('walletInfo', JSON.stringify(updatedWalletInfo));
        }
      };

      const handleChainChanged = (chainId) => {
        const chainIdDecimal = parseInt(chainId, 16);
        const networkName = chainIdDecimal === 11155111 ? 'Sepolia' : 
                          chainIdDecimal === 1 ? 'Mainnet' : 'Unknown';
        setCurrentNetwork(networkName);
      };

      window.ethereum?.on('accountsChanged', handleAccountsChanged);
      window.ethereum?.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, [walletInfo]);

  return (
  <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
  <div className="sticky top-0 z-10 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-primary)] rounded-lg">
                <Icon name="Heart" size={20} className="text-[var(--color-bg)]" />
              </div>
              <span className="text-xl font-semibold text-[var(--color-text)]">PULSE</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[var(--color-primary-light)]">
                <div className={`w-2 h-2 rounded-full ${
                  networkStatus === 'connected' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-warning)]'
                }`} />
                <span className="text-sm text-[var(--color-text-muted)]">{currentNetwork}</span>
              </div>
              {connectionState === 'connected' && currentNetwork !== 'Sepolia' && (
                <button
                  onClick={handleNetworkSwitch}
                  className="text-xs px-2 py-1 bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/30 rounded hover:bg-[var(--color-warning)]/20 transition-colors"
                >
                  {t('auth.switchToSepolia')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
  <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
            {connectionState === 'connected' ? (
              <ConnectedWalletInfo
                walletAddress={walletInfo?.address}
                walletType={walletInfo?.type}
                did={walletInfo?.did}
                balance={walletInfo?.balance}
                onDisconnect={handleDisconnect}
                onNavigateToDashboard={handleNavigateToDashboard}
              />
            ) : (
              <>
                {/* Welcome Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-[var(--color-primary)] rounded-2xl mx-auto mb-4">
                    <Icon name="Heart" size={32} className="text-[var(--color-bg)]" />
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-semibold text-[var(--color-text)] mb-2">
                    {t('auth.welcomeTitle')}
                  </h1>
                  <p className="text-[var(--color-text-muted)] text-sm lg:text-base">
                    {t('auth.welcomeSubtitle')}
                  </p>
                </div>

                {/* Wallet Selector */}
                <WalletSelector
                  onWalletSelect={handleWalletSelect}
                  isConnecting={connectionState === 'connecting'}
                  selectedWallet={null}
                  error={error}
                />

                {/* Advanced Options Toggle */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-colors"
                  >
                    <Icon name={showAdvanced ? "ChevronUp" : "ChevronDown"} size={16} />
                    <span>{showAdvanced ? t('common.hide') : t('common.show')} {t('auth.advancedOptions')}</span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <NetworkStatus
                        currentNetwork={currentNetwork}
                        networkStatus={networkStatus}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:block w-80 xl:w-96 bg-muted/30 border-l border-border p-6 overflow-y-auto">
          <div className="space-y-8">
            {connectionState !== 'connected' && <SecurityFeatures />}
            <TrustIndicators />
          </div>
        </div>
      </div>
      {/* Mobile Security Features - Show when not connected */}
      {connectionState !== 'connected' && (
        <div className="lg:hidden px-4 pb-8">
          <SecurityFeatures />
        </div>
      )}
      {/* Footer */}
      <div className="border-t border-border bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-4">
            <p className="text-xs text-muted-foreground">
              {t('auth.legal.byConnecting')}{' '}
              <button className="text-primary hover:underline">{t('auth.legal.terms')}</button>
              {' '} {t('auth.legal.and')} {' '}
              <button className="text-primary hover:underline">{t('auth.legal.privacy')}</button>
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <span>© {new Date()?.getFullYear()} PULSE</span>
              <span>•</span>
              <button className="hover:text-foreground transition-clinical">{t('auth.footer.support')}</button>
              <span>•</span>
              <button className="hover:text-foreground transition-clinical">{t('auth.footer.docs')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionAuthentication;