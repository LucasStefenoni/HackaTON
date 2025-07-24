// app/api/fee/route.ts
import { NextResponse } from 'next/server';
import { TonClient }    from '@ton/ton';
import { Address }      from '@ton/core';
import { FeePayment }   from '@/contracts/build/FeePayment_FeePayment';

export async function GET() {
  try {
    // Usa as variáveis de ambiente do servidor (não NEXT_PUBLIC)
    const endpoint = `${process.env.RPC_ENDPOINT}?api_key=${process.env.TONCENTER_API_KEY}`;
    const client   = new TonClient({ endpoint });

    const addr     = Address.parse(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!);
    const contract = client.open(FeePayment.fromAddress(addr));

    const num = await contract.getGetFeeNumerator();
    const den = await contract.getGetFeeDenominator();

    return NextResponse.json({
      numerator:   Number(num),
      denominator: Number(den),
    });
  } catch (e: any) {
    console.error('Erro em /api/fee:', e);
    return NextResponse.json(
      { error: e.message || 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
