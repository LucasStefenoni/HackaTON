// src/contexts/TelegramContext.tsx
'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { retrieveRawInitData, on } from '@telegram-apps/sdk';

type InitData = any; // você pode trocar por uma interface mais precisa se quiser
type ThemeParams = Record<string, string | undefined>;

interface TelegramContextValue {
  initData: InitData | null;
  error: string | null;
  loading: boolean;
  themeParams: ThemeParams | null;
}

const TelegramContext = createContext<TelegramContextValue>({
  initData: null,
  error: null,
  loading: true,
  themeParams: null,
});

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [initData, setInitData] = useState<InitData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [themeParams, setThemeParams] = useState<ThemeParams | null>(null);

  // 1) busca e valida initData
  useEffect(() => {
    const initDataRaw = retrieveRawInitData();
    fetch('/api/validate', {
      method: 'POST',
      headers: { 'Authorization': `tma ${initDataRaw}` },
    })
      .then(async res => {
        const json = await res.json();
        if (!res.ok || !json.valid) {
          throw new Error(json.error || 'Falha na validação');
        }
        setInitData(json.initData);
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  // 2) lê tema inicial do WebApp global e ouve mudanças
  useEffect(() => {
    const WebApp = (window as any).Telegram?.WebApp;
    if (!WebApp) return;

    // tema inicial
    setThemeParams(WebApp.themeParams);
    // sinaliza que está pronto
    WebApp.ready();

    // escuta mudanças de tema (snake_case)
    const off = on<'theme_changed'>('theme_changed', payload => {
      setThemeParams(payload.theme_params);
    });
    return () => off();
  }, []);

  // 3) aplicar CSS vars só quando o valor existir
  useEffect(() => {
    if (!themeParams) return;
    if (themeParams.bg_color) {
      document.body.style.backgroundColor = themeParams.bg_color;
    }
    if (themeParams.section_bg_color) {
      document.documentElement.style.setProperty('--header-bg', themeParams.section_bg_color);
    }
    if (themeParams.text_color) {
      document.documentElement.style.setProperty('--header-text', themeParams.text_color);
    }
  }, [themeParams]);

  return (
    <TelegramContext.Provider value={{ initData, error, loading, themeParams }}>
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => useContext(TelegramContext);


