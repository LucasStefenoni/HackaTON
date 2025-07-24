import { prisma } from '@/app/lib/prisma';
import { withTelegramAuth } from '@/app/lib/requireAuth';
import { kMaxLength } from 'buffer';
import { NextResponse } from 'next/server';

export const GET = withTelegramAuth(async (req: Request, initData: any) => {
  const url = new URL(req.url);
  const bagId = Number(url.searchParams.get('id'));

  if (!bagId) {
    return NextResponse.json({ error: 'ID da bag não fornecido' }, { status: 400 });
  }

  if (!initData?.user?.id) {
    return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
  }

  try {
    const userId = BigInt(initData.user.id);

    const bag = await prisma.bag.findUnique({
      where: { id: bagId },
    });

    if (!bag || bag.state !== 'AWAITING_PAYMENTS') {
      return NextResponse.json({ error: 'Bag inválida ou não está aguardando pagamentos' }, { status: 400 });
    }

    const cotacaoResp = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=brl');
    const cotacaoJson = await cotacaoResp.json();
    const cotacaoTON = cotacaoJson['the-open-network']?.brl;

    if (!cotacaoTON) {
      return NextResponse.json({ error: 'Erro ao obter cotação do TON' }, { status: 500 });
    }

    const pendencias = await prisma.pendingPayment.findMany({
          where: {
            bag_id: bagId,
            user_id_from: userId,
            pago: false,
          },
          include: {
            recebedor: {
              select: {
                first_name: true,
                username:    true,
                wallet_address: true,
              },
            },
          },
        });


    const pagamentos = pendencias.map(p => ({
        id: p.id,
        valor_brl: parseFloat(p.valor.toString()),
        valor_ton: parseFloat((parseFloat(p.valor.toString()) / cotacaoTON).toFixed(3)),
        para: {
          id:    p.user_id_to.toString(),
          nome:  p.recebedor.first_name || p.recebedor.username || 'Participante',
          wallet: p.recebedor.wallet_address, 
        },
      }));

    return NextResponse.json({
      pagamentos,
      cotacao_ton_brl: cotacaoTON,
    });
  } catch (err) {
    console.error('[GET /pendingPayments]', err);
    return NextResponse.json({ error: 'Erro ao buscar pendências' }, { status: 500 });
  }
});
