"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@/contexts/TelegramContext";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import Image from "next/image";
import { telegramFetch } from "@/app/lib/telegramFetch";

export default function PerfilPage() {
  const { initData, loading, error, themeParams } = useTelegram();
  const [savedAddress, setSavedAddress] = useState<string | null>(null);
  const walletAddress = useTonAddress();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Busca a carteira salva no banco
  useEffect(() => {
    if (!initData?.user?.id) return;
    setStatusMessage("");
    telegramFetch("/api/userWallet")
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.address) {
          setSavedAddress(json.address);
        }
      })
      .catch(() => {});
  }, [initData?.user?.id]);

  // Atualiza carteira no banco se conectada e diferente
  useEffect(() => {
    if (!walletAddress || !initData?.user?.id) return;
    if (walletAddress === savedAddress) return;

    telegramFetch("/api/saveWallet", {
      method: "POST",
      body: JSON.stringify({ address: walletAddress }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) {
          setSavedAddress(walletAddress);
          setStatusMessage("Carteira atualizada com sucesso.");
        } else {
          setStatusMessage(json.error || "Erro ao salvar carteira");
        }
      })
      .catch(() => {
        setStatusMessage("Erro ao salvar carteira");
      });
  }, [walletAddress, initData?.user?.id, savedAddress]);

  if (loading || !initData) {
    return <p className="p-4">Carregando dados do Telegram…</p>;
  }

  const user = initData.user;
  const photoUrl = user.photo_url || `https://t.me/i/userpic/320/${user.username}.jpg`;

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ backgroundColor: "#000000", color: themeParams?.text_color || "#FFFFFF" }}>
      <div className="flex items-center space-x-4">
        <Image
          src={photoUrl}
          alt="Foto de perfil"
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <h1 className="text-xl font-semibold">{user.first_name} {user.last_name || ""}</h1>
          {user.username && <p className="text-sm text-gray-300">@{user.username}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <TonConnectButton />
        {savedAddress ? (
          <>
            <p className="text-sm">Carteira salva: <span className="font-mono text-blue-300">{savedAddress}</span></p>
            {walletAddress ? (
              walletAddress !== savedAddress ? (
                <p className="text-yellow-300 text-sm">Você está conectado com uma carteira diferente. Ela será atualizada automaticamente.</p>
              ) : (
                <p className="text-green-400 text-sm">Você está conectado com sua carteira atual.</p>
              )
            ) : (
              <p className="text-sm text-gray-400">Você não está conectado com nenhuma carteira. Conecte para trocar.</p>
            )}
          </>
        ) : (
          walletAddress ? (
            <p className="text-sm text-blue-300">Conectado com {walletAddress}. Salvando carteira…</p>
          ) : (
            <p className="text-sm text-gray-400">Conecte sua carteira para vinculá-la ao seu perfil.</p>
          )
        )}
        {statusMessage && <p className="text-sm text-white/80">{statusMessage}</p>}
      </div>
    </div>
  );
}
