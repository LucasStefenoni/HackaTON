// global.d.ts

export {}; // torna este arquivo um módulo

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        close: () => void;
        themeParams: {
          bg_color: string;
          section_bg_color: string;
          text_color: string;
          [key: string]: string;
        };
        safeAreaInset: {
          top: number;
          bottom: number;
        };
      };
    };
  }
}
