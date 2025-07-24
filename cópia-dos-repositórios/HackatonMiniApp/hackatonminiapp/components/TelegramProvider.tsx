'use client';

import { useEffect } from 'react';


export default function TelegramProvider() {
  useEffect(() => {
    const WebApp = window.Telegram?.WebApp;
    if (!WebApp) return;

    // 1) Informar ao Telegram que o app está pronto
    WebApp.ready();

    // 2) Ajustar cores do body e CSS variables para usarmos no layout
    document.body.style.backgroundColor = WebApp.themeParams.bg_color;
    document.documentElement.style.setProperty('--header-bg', WebApp.themeParams.section_bg_color);
    document.documentElement.style.setProperty('--header-text', WebApp.themeParams.text_color);
  }, []);

  return null;
}