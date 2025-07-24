// app/testeContrato/ConnectWallet.tsx
"use client";

import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";

export function ConnectWallet() {
  const address = useTonAddress();  // retorna "" enquanto não conectado

  return (
    <div className="flex flex-col items-start space-y-2">
      <TonConnectButton /> 
      {address && (
        <p className="text-sm">
          Conectado: {address}
        </p>
      )}
    </div>
  );
}
