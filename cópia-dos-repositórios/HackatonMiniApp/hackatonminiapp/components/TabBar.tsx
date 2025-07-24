'use client';

import { usePathname, useRouter } from 'next/navigation';
import { HiHome, HiPlusCircle, HiUser } from 'react-icons/hi';
import { useEffect, useState } from 'react';

const tabs = [
  { label: 'Grupos', icon: HiHome, href: '/' },
  { label: 'Perfil', icon: HiUser, href: '/perfil' },
];

export default function TabBar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [insetBottom, setInsetBottom] = useState(0);

  useEffect(() => {
    // roda só no cliente, evitando SSR errors
    if (typeof window !== 'undefined') {
      const wb = window.Telegram?.WebApp?.safeAreaInset;
      setInsetBottom(wb?.bottom ?? 0);
    }
  }, []);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex bg-white border-t"
      style={{ paddingBottom: insetBottom }}
    >
      {tabs.map(tab => {
        const active = pathname === tab.href;
        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`flex-1 py-2 flex flex-col items-center justify-center ${
              active ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <tab.icon size={24} />
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
