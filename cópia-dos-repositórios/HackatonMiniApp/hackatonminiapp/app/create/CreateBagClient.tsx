"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTelegram } from '@/contexts/TelegramContext';
import { telegramFetch } from '../lib/telegramFetch';

export default function CreateBagClient() {
  const params  = useSearchParams();
  const chatId  = params.get('chat_id');
  const adminId = params.get('admin_id');

  const { initData, loading } = useTelegram();
  const [name, setName]     = useState('');
  const [error, setError]   = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (loading) return <p>Carregando…</p>;
  if (!initData?.user) {
    return <p className="text-red-600">Erro: dados do usuário não encontrados.</p>;
  }
  if (initData.user.id.toString() !== adminId) {
    return <p className="text-red-600">Não autorizado.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return setError('Informe um nome');
    setSaving(true);

    try {
      const res = await telegramFetch('/api/createBag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: Number(chatId),
          name,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Erro desconhecido');
      window.Telegram?.WebApp.close();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold">Nova Bag</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full p-3 border rounded-lg"
          placeholder="Nome da Bag"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Criando…' : 'Criar Bag'}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
