import { prisma } from '@/app/lib/prisma';
import { withTelegramAuth } from '@/app/lib/requireAuth';
import { NextResponse } from 'next/server';

export const GET = withTelegramAuth(async (_req: Request, initData: any) => {
  if (!initData?.user?.id) {
    return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: BigInt(initData.user.id) },
      select: { wallet_address: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ address: user.wallet_address });
  } catch (err) {
    console.error('[GET /userWallet]', err);
    return NextResponse.json({ error: 'Erro ao buscar carteira' }, { status: 500 });
  }
});
