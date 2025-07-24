import { NextResponse }     from 'next/server';
import { withTelegramAuth } from '@/app/lib/requireAuth';
import { prisma }           from '@/app/lib/prisma';

export async function  POST(req: Request) {
  const { pendingPaymentId, inMessageBoc, walletAddress } = await req.json();
  console.log(pendingPaymentId);
  console.log(inMessageBoc);
  
  if (!pendingPaymentId || typeof inMessageBoc !== 'string') {
    return NextResponse.json(
      { error: 'pendingPaymentId e inMessageBoc são necessários' },
      { status: 400 }
    );
  }
  // Busca registro atual
  const existing = await prisma.pendingPayment.findUnique({
    where: { id: pendingPaymentId },
    select: { txHash: true, user_to_address: true }
  });
  if (!existing) {
     return NextResponse.json(
      { error: 'Falha ao registrar pendingPayment ' },
      { status: 404 }
    );
  }
  if (existing.txHash || existing.user_to_address) {
    return NextResponse.json(
      { error: 'Pagamento já em andamento ou confirmado' },
      { status: 404 }
    );
  }

  try {
    // Só salva o BOC da mensagem; o worker vai confirmar on‐chain e marcar pago
    await prisma.pendingPayment.update({
      where: { id: pendingPaymentId },
      data: { txHash: inMessageBoc ,user_to_address:  walletAddress,},
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Erro /api/markPaid:', e);
    return NextResponse.json(
      { error: 'Falha ao registrar inMessageBoc' },
      { status: 500 }
    );
  }
}
