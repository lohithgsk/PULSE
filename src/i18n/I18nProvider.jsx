import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { messages as catalogs } from './messages';

const I18nContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key, vars) => key,
});

const STORAGE_KEY = 'pulse.profile.lang';

export const I18nProvider = ({ children, initialLang }) => {
  const [lang, setLangState] = useState(() => {
    if (initialLang) return initialLang;
    try { return localStorage.getItem(STORAGE_KEY) || 'en'; } catch { return 'en'; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
  }, []);

  const dict = useMemo(() => catalogs[lang] || catalogs.en, [lang]);

  const t = useCallback((key, vars = {}) => {
    // Resolve a dotted key path like 'settings.title' in a given catalog
    const resolve = (catalog, path) => {
      const parts = String(path).split('.');
      let cur = catalog;
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
        else return undefined;
      }
      return typeof cur === 'string' ? cur : undefined;
    };

    // Try current language first, then fall back to English
    let str = resolve(dict, key);
    if (str === undefined) str = resolve(catalogs?.en || {}, key);
    if (str === undefined) return key;

    // simple var replacement: {name}
    return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
  }, [dict]);

  const value = useMemo(() => ({ lang, setLang, t, catalogs }), [lang, setLang, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
