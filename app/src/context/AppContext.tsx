import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

export type Language = 'en' | 'hi' | 'both';

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => Promise<void>;
  reloadFavourites: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('both');
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());

  const reloadFavourites = useCallback(async () => {
    try {
      const res = await api.getFavourites();
      setFavouriteIds(new Set(res.items.map((p) => p.id)));
    } catch {}
  }, []);

  useEffect(() => {
    reloadFavourites();
  }, [reloadFavourites]);

  const isFavourite = useCallback((id: string) => favouriteIds.has(id), [favouriteIds]);

  const toggleFavourite = useCallback(
    async (id: string) => {
      const was = favouriteIds.has(id);
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        if (was) next.delete(id);
        else next.add(id);
        return next;
      });
      try {
        if (was) await api.removeFavourite(id);
        else await api.addFavourite(id);
      } catch {
        setFavouriteIds((prev) => {
          const next = new Set(prev);
          if (was) next.add(id);
          else next.delete(id);
          return next;
        });
      }
    },
    [favouriteIds]
  );

  return (
    <AppContext.Provider value={{ language, setLanguage, isFavourite, toggleFavourite, reloadFavourites }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
