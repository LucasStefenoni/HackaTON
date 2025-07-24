import { NextResponse } from 'next/server';
import { validate, parse, type InitData } from '@telegram-apps/init-data-node';

export async function validateTelegram(req: Request): Promise<InitData> {
  const auth = req.headers.get('authorization') || '';
  const [type, raw = ''] = auth.split(' ');
  if (type !== 'tma' || !raw) {
    throw new Error('Unauthorized');
  }
  // valida (usa o mesmo bot token do /api/validate)
  validate(raw, process.env.BOT_TOKEN!, { expiresIn: 3600 });
  return parse(raw);
}

// Um HOF para envolver seus handlers e injetar o initData:
export function withTelegramAuth<
  H extends (req: Request, initData: InitData) => Promise<NextResponse>
>(handler: H) {
  return async (req: Request) => {
    try {
      const initData = await validateTelegram(req);
      return handler(req, initData);
    } catch (err: any) {
      return NextResponse.json(
        { valid: false, error: err.message },
        { status: err.message === 'Unauthorized' ? 401 : 400 }
      );
    }
  };
}
