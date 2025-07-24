import { prisma } from '@/app/lib/prisma';
import { withTelegramAuth } from '@/app/lib/requireAuth';
import { NextResponse } from 'next/server';

export const POST = withTelegramAuth(async (req: Request, initData: any) => {
  if (!initData?.user?.id) {
    return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
  }

  try {
    const { address } = await req.json();

    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'Endereço inválido' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: BigInt(initData.user.id) },
      data: { wallet_address: address },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /saveWallet]', err);
    return NextResponse.json({ error: 'Erro ao salvar carteira' }, { status: 500 });
  }
});
