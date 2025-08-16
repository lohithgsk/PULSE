import React, { useRef, useState, useEffect } from 'react';
import { useSession } from '../../context/SessionContext';
import AuthenticationGate from './AuthenticationGate';
import { blockchainService } from '../../utils/blockchainService';
import { connectWithWalletConnect, disconnectWalletConnect } from '../../utils/walletConnectService';
import { useToast } from './ToastProvider';

// Simple protected route wrapper for client-side gating
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, login } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const currentWalletRef = useRef(null);

  // no local toast timer needed with provider

  const handleWalletConnect = async (walletId) => {
    setError(null);
    setIsConnecting(true);
    currentWalletRef.current = walletId;
    try {
      if (walletId === 'metamask') {
        const info = await blockchainService.connectWallet();
        login({
          provider: info?.type || 'MetaMask',
          address: info?.address || null,
          did: info?.did || null,
          chainId: info?.chainId || null,
          network: info?.network || null,
          balance: info?.balance || null,
        });
  toast.success('Wallet connected via MetaMask');
        return;
      }

      if (walletId === 'walletconnect') {
        let timeoutId;
        try {
          const connectPromise = connectWithWalletConnect();
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              toast.error('WalletConnect connection timed out.');
              reject(new Error('WalletConnect cancelled or timed out.'));
            }, 30000);
          });

          const info = await Promise.race([connectPromise, timeoutPromise]);
          if (timeoutId) clearTimeout(timeoutId);
          login({
            provider: info?.type || 'WalletConnect',
            address: info?.address || null,
            did: info?.did || null,
            chainId: info?.chainId || null,
            network: info?.network || null,
            balance: info?.balance || null,
          });
          toast.success('Wallet connected via WalletConnect');
          return;
        } catch (err) {
          if (timeoutId) clearTimeout(timeoutId);
          // Ensure any dangling session closed on cancel
          try { await disconnectWalletConnect(); } catch (_) {}
          const msg = err?.message || '';
          if (/closed|cancel/i.test(msg)) {
            toast.error('WalletConnect cancelled by user.');
            throw new Error('WalletConnect cancelled by user.');
          }
          throw err || new Error('WalletConnect failed.');
        }
      }

      throw new Error('Provider not supported yet.');
    } catch (e) {
  setError(e?.message || 'Failed to connect. Please try again.');
  toast.error(e?.message || 'Failed to connect. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCancelConnect = async () => {
    // Allow users to stop the spinner and go back if they dismiss the WalletConnect modal
    setIsConnecting(false);
    if (currentWalletRef.current === 'walletconnect') {
      try { await disconnectWalletConnect(); } catch (_) {}
    }
    toast.info('Connection cancelled.');
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthenticationGate
          onWalletConnect={handleWalletConnect}
          onCancelConnect={handleCancelConnect}
          isConnecting={isConnecting}
          error={error}
        />
      </>
    );
  }

  return (
    <>
      {children}
    </>
  );
};

export default ProtectedRoute;
