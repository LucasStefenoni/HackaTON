import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { withTelegramAuth } from '@/app/lib/requireAuth';

export const GET = withTelegramAuth(async (_req, initData) => {
  try {
    if (!initData?.user) {
      return NextResponse.json(
        { error: 'Dados do usuário não encontrados' },
        { status: 400 }
      );
    }

    const userId = BigInt(initData.user.id);

    // Busca as bags em que o usuário participa
    const rawBags = await prisma.bag.findMany({
      where: {
        participants: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        participants: true,
      },
    });

    const bags = rawBags.map(b => ({
      id: b.id,
      name: b.name,
      chat_id: b.chat_id.toString(),
      admin_user_id: b.admin_user_id.toString(),
      created_at: b.created_at.toISOString(),
      welcome_message_id: b.welcome_message_id != null
        ? b.welcome_message_id.toString()
        : null,
    }));

    return NextResponse.json({ bags });
  } catch (error) {
    console.error('Erro ao buscar bags:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar bags no banco de dados' },
      { status: 500 }
    );
  }
});
