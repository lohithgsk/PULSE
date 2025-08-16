import React, { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import AuthenticationGate from './AuthenticationGate';
import { blockchainService } from '../../utils/blockchainService';
import { connectWithWalletConnect } from '../../utils/walletConnectService';

// Simple protected route wrapper for client-side gating
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, login } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const handleWalletConnect = async (walletId) => {
    setError(null);
    setIsConnecting(true);
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
        return;
      }

      if (walletId === 'walletconnect') {
        const info = await connectWithWalletConnect();
        login({
          provider: info?.type || 'WalletConnect',
          address: info?.address || null,
          did: info?.did || null,
          chainId: info?.chainId || null,
          network: info?.network || null,
          balance: info?.balance || null,
        });
        return;
      }

      throw new Error('Provider not supported yet.');
    } catch (e) {
      setError(e?.message || 'Failed to connect. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthenticationGate
        onWalletConnect={handleWalletConnect}
        isConnecting={isConnecting}
        error={error}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
