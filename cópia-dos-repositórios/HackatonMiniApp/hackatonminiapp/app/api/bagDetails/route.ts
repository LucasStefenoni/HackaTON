import { prisma } from '@/app/lib/prisma';
import { withTelegramAuth } from '@/app/lib/requireAuth';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const url = new URL(req.url);
  const bagId = Number(url.searchParams.get('id'));

  if (!bagId) {
    return NextResponse.json({ error: 'ID da bag não fornecido' }, { status: 400 });
  }

  const bag = await prisma.bag.findUnique({
    where: { id: bagId },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      transactions: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!bag) {
    return NextResponse.json({ error: 'Bag não encontrada' }, { status: 404 });
  }

  const members = bag.participants.map(bu => ({
    id: bu.user_id.toString(),
    name: bu.user.first_name || bu.user.username || 'Usuário desconhecido',
    total_spent: bu.total_spent || 0,
  }));

  const transactions = bag.transactions.map(tx => ({
    id: tx.id,
    message_text: tx.message_text,
    user_name: tx.user.first_name || tx.user.username || 'Usuário desconhecido',
    created_at: tx.created_at.toISOString(),
  }));

  return NextResponse.json({
    name: bag.name,
    members,
    transactions,
  });
};

export const GET = process.env.NODE_ENV !== 'development' ? withTelegramAuth(handler) : handler;
