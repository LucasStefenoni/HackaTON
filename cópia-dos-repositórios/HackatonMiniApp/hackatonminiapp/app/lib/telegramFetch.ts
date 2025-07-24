import { retrieveRawInitData } from '@telegram-apps/sdk';

export async function telegramFetch(input: RequestInfo, init: RequestInit = {}) {
  // pega o initDataRaw fresco toda vez
  const initDataRaw = retrieveRawInitData();

  const authHeader = `tma ${initDataRaw}`;
  const headers = {
    // mantém qualquer header que você já tenha passado
    ...(init.headers as Record<string, string> | undefined),
    Authorization: authHeader,
  };

  return fetch(input, {
    ...init,
    headers,
  });
}


