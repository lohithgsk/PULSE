import React, { useRef, useState } from 'react';
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
        // Add a safety timeout so closing the QR modal doesn't leave the UI spinning forever
        let timeoutId;
        try {
          const connectPromise = connectWithWalletConnect();
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error('WalletConnect cancelled or timed out.'));
            }, 25000);
          });

          const info = await Promise.race([connectPromise, timeoutPromise]);
          clearTimeout(timeoutId);
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
        } catch (err) {
          // Ensure any dangling session is closed and surface a friendly message
          try { await disconnectWalletConnect(); } catch (_) {}
          const msg = err?.message || '';
          if (/closed|cancel/i.test(msg)) {
            throw new Error('WalletConnect cancelled by user.');
          }
          throw err;
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
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
