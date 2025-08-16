import React, { useRef, useState, useEffect } from 'react';
import { useSession } from '../../context/SessionContext';
import AuthenticationGate from './AuthenticationGate';
import { blockchainService } from '../../utils/blockchainService';
import { connectWithWalletConnect, disconnectWalletConnect } from '../../utils/walletConnectService';
import Toast from './Toast';

// Simple protected route wrapper for client-side gating
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, login } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }
  const currentWalletRef = useRef(null);

  // Automatically clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
        setToast({ message: 'Wallet connected via MetaMask', type: 'success' });
        return;
      }

      if (walletId === 'walletconnect') {
        let timeoutId;
        let info = null;
        let connectError = null;
        try {
          const connectPromise = connectWithWalletConnect();
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              setToast({ message: 'WalletConnect connection timed out.', type: 'error' });
              reject(new Error('WalletConnect cancelled or timed out.'));
            }, 30000);
          });

          info = await Promise.race([connectPromise, timeoutPromise]);
        } catch (err) {
          connectError = err;
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
          // Always disconnect to ensure session is closed
          try { await disconnectWalletConnect(); } catch (_) {}
        }

        if (info) {
          login({
            provider: info?.type || 'WalletConnect',
            address: info?.address || null,
            did: info?.did || null,
            chainId: info?.chainId || null,
            network: info?.network || null,
            balance: info?.balance || null,
          });
          setToast({ message: 'Wallet connected via WalletConnect', type: 'success' });
          return;
        } else {
          const msg = connectError?.message || '';
          if (/closed|cancel/i.test(msg)) {
            setToast({ message: 'WalletConnect cancelled by user.', type: 'error' });
            throw new Error('WalletConnect cancelled by user.');
          }
          throw connectError || new Error('WalletConnect failed.');
        }
      }

      throw new Error('Provider not supported yet.');
    } catch (e) {
      setError(e?.message || 'Failed to connect. Please try again.');
      setToast({ message: e?.message || 'Failed to connect. Please try again.', type: 'error' });
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
    setToast({ message: 'Connection cancelled.', type: 'info' });
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
        {/* Only render Toast once, outside of AuthenticationGate */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  return (
    <>
      {children}
      {/* Only render Toast once, outside of children */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ProtectedRoute;
