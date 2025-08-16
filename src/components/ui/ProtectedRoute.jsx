import React, { useState } from 'react';
import { useSession } from '../../context/SessionContext';
import AuthenticationGate from './AuthenticationGate';

// Simple protected route wrapper for client-side gating
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, login } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const handleWalletConnect = async (walletId) => {
    // For now, simulate a wallet connect and mark session authenticated
    setError(null);
    setIsConnecting(true);
    try {
      // Simulate small delay
      await new Promise((res) => setTimeout(res, 600));
      // Minimal session login; later replace with real wallet connect
      login({ provider: walletId, address: null });
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
