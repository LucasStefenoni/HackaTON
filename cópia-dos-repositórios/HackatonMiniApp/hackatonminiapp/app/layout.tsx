// app/layout.tsx
'use client';

import './globals.css';
import { ReactNode } from 'react';
import { TelegramProvider } from '@/contexts/TelegramContext';
import TabBar from '@/components/TabBar';
import { TonConnectUIProvider } from "@tonconnect/ui-react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const manifestUrl = `${process.env.NEXT_PUBLIC_DAPP_URL}/tonconnect-manifest.json`;

  return (
    <html lang="pt-BR">
      <head />
      <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <TelegramProvider>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          {/* Cabeçalho fixo e com efeito de desfoque */}
          <header
            className="sticky top-0 z-10 py-4 text-center font-bold backdrop-blur-md bg-opacity-80"
            style={{
              backgroundColor: 'var(--header-bg)',
              color: 'var(--header-text)',
            }}
          >
            SplitApp
          </header>

          {/* Conteúdo principal com container responsivo */}
          <main className="flex-1 overflow-auto px-4 py-6 max-w-md mx-auto w-full">
            {children}
          </main>

          {/* Navegação inferior, respeitando safe-area */}
          <div className="pb-4 bg-white dark:bg-gray-800">
            <div className="max-w-md mx-auto w-full">
              <TabBar />
            </div>
          </div>
           </TonConnectUIProvider>
         </TelegramProvider>
      </body>
    </html>
  );
}
