'use client';

import { useTelegram } from '@/contexts/TelegramContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { telegramFetch } from './lib/telegramFetch';
import { HiChevronRight } from 'react-icons/hi';

interface Bag {
  id: number;
  name: string;
  chat_id: string;
  admin_user_id: string;
  created_at: string;
  welcome_message_id?: string | null;
}

export default function HomePage() {
  const { initData, error, loading, themeParams } = useTelegram();
  const [bags, setBags] = useState<Bag[] | null>(null);
  const [bagsLoading, setBagsLoading] = useState(false);
  const [bagsError, setBagsError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!initData) return; // só busca quando tivermos initData
    setBagsLoading(true);

    telegramFetch('/api/userBags')
      .then(async res => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || 'Falha ao carregar bags');
        }
        setBags(payload.bags);
      })
      .catch(err => setBagsError((err as Error).message))
      .finally(() => setBagsLoading(false));
  }, [initData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p
          style={{
            color: themeParams?.text_color || '#FFFFFF', // Usa o text_color do Telegram ou branco como padrão
          }}
        >
          Carregando dados do Telegram…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p
          style={{
            color: themeParams?.text_color || '#FFFFFF', // Usa o text_color do Telegram ou branco como padrão
          }}
        >
          Erro: {error}
        </p>
      </div>
    );
  }

  if (!initData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p
          style={{
            color: themeParams?.text_color || '#FFFFFF', // Usa o text_color do Telegram ou branco como padrão
          }}
        >
          Nenhum dado de usuário encontrado.
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-4 space-y-6 min-h-screen"
      style={{
        backgroundColor: '#000000', // Fundo preto fixo
        color: themeParams?.text_color || '#FFFFFF', // Usa o text_color do Telegram ou branco como padrão
      }}
    >
      {/* Boas-vindas num card */}
      <div className="bg-gradient-to-l from-slate-900 to-blue-900 rounded-2xl shadow-lg p-4 space-y-2">
        <h1 className="text-2xl font-bold text-white">Olá, {initData.user.first_name}!</h1> {/* Sempre branco */}
      </div>

      {/* Lista de Bags */}
      <div className="space-y-4">
        <h2
          className="text-lg font-semibold text-white" // Sempre branco
        >
          Minhas Bags
        </h2>

        {bagsLoading && (
          <div className="flex items-center justify-center py-6">
            <p
              style={{
                color: themeParams?.text_color || '#FFFFFF', // Garante que o texto acompanhe o tema
              }}
            >
              Carregando suas bags…
            </p>
          </div>
        )}

        {bagsError && (
          <div className="p-4 bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-md">
            <p
              style={{
                color: themeParams?.text_color || '#FFFFFF', // Garante que o texto acompanhe o tema
              }}
            >
              Erro ao carregar bags: {bagsError}
            </p>
          </div>
        )}

        {!bagsLoading && bags && bags.length > 0 && (
          <ul className="space-y-3">
            {bags.map(bag => (
              <li
                key={bag.id}
                className="bg-gradient-to-r from-blue-800 to-indigo-900 shadow-sm rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex justify-between items-center cursor-pointer"
                onClick={() => router.push(`/group/${bag.id}`)} // Mantém o redirecionamento
              >
                <div className="space-y-1">
                  <h3 className="text-md font-semibold text-white">{bag.name}</h3> {/* Texto fixo dentro do card */}
                  <p className="text-xs text-gray-300">Criada em {new Date(bag.created_at).toLocaleDateString()}</p> {/* Texto fixo dentro do card */}
                </div>
                <HiChevronRight className="text-gray-300" />
              </li>
            ))}
          </ul>
        )}

        {!bagsLoading && bags && bags.length === 0 && (
          <div className="flex items-center justify-center py-6">
            <p
              style={{
                color: themeParams?.text_color || '#FFFFFF', // Garante que o texto acompanhe o tema
              }}
            >
              Você não participa de nenhuma bag.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}