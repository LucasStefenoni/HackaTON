// app/api/validate/route.ts
import { NextResponse } from 'next/server';
import { validate, parse, type InitData } from '@telegram-apps/init-data-node';

// Rota POST /api/validate
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const [authType, initDataRaw = ''] = authHeader.split(' ');

  if (authType !== 'tma' || !initDataRaw) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    // Valida assinatura e expiração (1h)
    validate(initDataRaw, process.env.BOT_TOKEN!, { expiresIn: 3600 });

    // Parseia os dados
    const initData: InitData = parse(initDataRaw);

    return NextResponse.json({ valid: true, initData });
  } catch (e: any) {
    return NextResponse.json({ valid: false, error: e.message }, { status: 400 });
  }
}