import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SessionContext = createContext(undefined);
const SESSION_KEY = 'pulse.session';

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({ isAuthenticated: false, wallet: null, createdAt: null });

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && typeof data.isAuthenticated === 'boolean') {
          setSession(data);
        }
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // Persist session to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (_) {
      // ignore
    }
  }, [session]);

  const login = ({ provider, address, did = null, chainId = null, network = null, balance = null } = {}) => {
    const wallet = { provider: provider || 'unknown', address: address || null, did, chainId, network, balance };
    setSession({ isAuthenticated: true, wallet, createdAt: new Date().toISOString() });
  };

  const logout = () => setSession({ isAuthenticated: false, wallet: null, createdAt: null });

  const updateWallet = (partial = {}) => {
    setSession((prev) => ({
      ...prev,
      wallet: { ...(prev?.wallet || {}), ...partial },
    }));
  };

  const value = useMemo(() => ({ ...session, login, logout, updateWallet }), [session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
};

export default SessionContext;
