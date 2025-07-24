'use client';

import { useEffect, useState } from 'react';
import { useParams }            from 'next/navigation';
import { telegramFetch }        from '../../lib/telegramFetch';
import MemberCard               from '@/components/MemberCard';
import TransactionItem          from '@/components/TransactionItem';
import { useTelegram }          from '@/contexts/TelegramContext';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { TonClient }            from '@ton/ton';
import { Address, beginCell }   from '@ton/core';
import { storePayment }         from '@/contracts/build/FeePayment_FeePayment';

export default function GroupDetail() {
  const { id } = useParams();
  const { initData } = useTelegram();

  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const [members, setMembers]                 = useState<any[]>([]);
  const [txs, setTxs]                         = useState<any[]>([]);
  const [bagName, setBagName]                 = useState<string | null>(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState<string | null>(null);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [cotacaoTon, setCotacaoTon]           = useState<number>(0);

  const [feeNum, setFeeNum] = useState<number>(0);
  const [feeDen, setFeeDen] = useState<number>(1);

  // Ton RPC client
  const rpcEndpoint = `${process.env.NEXT_PUBLIC_RPC_ENDPOINT}?api_key=${process.env.NEXT_PUBLIC_TONCENTER_API_KEY}`;
  const clientRpc   = new TonClient({ endpoint: rpcEndpoint });

  // 1) fetch bag details + pending payments
  useEffect(() => {
    async function fetchBagDetails() {
      try {
        const res = process.env.NODE_ENV === 'development'
          ? await fetch(`/api/bagDetails?id=${id}`)
          : await telegramFetch(`/api/bagDetails?id=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao carregar detalhes da bag');
        setBagName(data.name);

        const sessionId = String(initData?.user?.id);
        const selfM = data.members.find((m: any) => m.id === sessionId);
        const others = data.members.filter((m: any) => m.id !== sessionId);
        setMembers(selfM ? [selfM, ...others] : others);

        setTxs(data.transactions);

        const respP = process.env.NODE_ENV === 'development'
          ? await fetch(`/api/pendingPayments?id=${id}`)
          : await telegramFetch(`/api/pendingPayments?id=${id}`);
        const pd = await respP.json();
        if (respP.ok) {
          setPendingPayments(pd.pagamentos);
          setCotacaoTon(pd.cotacao_ton_brl);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBagDetails();
  }, [id, initData]);

 useEffect(() => {
    async function fetchFee() {
      try {
        const res = await fetch('/api/fee');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Erro ao ler fee');
        setFeeNum(json.numerator);
        setFeeDen(json.denominator);
      } catch (e: any) {
        console.error('Erro ao ler fee via API:', e);
      }
    }
    fetchFee();
  }, []);
  
  // 3) handlePay agora só envia + registra inMessageBoc
  const handlePay = async (p: any) => {
    if (!walletAddress) {
      alert('❗ Conecte sua carteira em seu perfil antes de efetuar pagamentos.');
      return;
    }

    // recalc fee on-chain
    const feeRes = await fetch('/api/fee');
    const feeJson = await feeRes.json();
    const currentNum = feeJson.numerator;
    const currentDen = feeJson.denominator;
    if (currentNum !== feeNum || currentDen !== feeDen) {
      if (!confirm(
        `🚨 A taxa mudou de ${feeNum}/${feeDen} para ${currentNum}/${currentDen}.\n` +
        `Deseja usar a nova taxa?`
      )) return;
      setFeeNum(currentNum);
      setFeeDen(currentDen);
    }

    // compute amounts in nanoTON
    const principalNano = BigInt(Math.floor(p.valor_ton * 1e9));
    const feeNano       = BigInt(Math.floor(p.valor_ton * currentNum / currentDen * 1e9));
    const totalNano     = principalNano + feeNano;

    // build payload
    const recipient = Address.parse(p.para.wallet);
    const paymentPayload = {
      $$type: 'Payment' as const,
      amount: principalNano,
      recipient,
    };
    const bodyCell = beginCell().store(storePayment(paymentPayload)).endCell();

    // 3.1) send via TonConnect
    const res = await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [{
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        amount:  totalNano.toString(),
        payload: bodyCell.toBoc().toString('base64'),
      }],
    });
    console.log('TonConnect sendTransaction response:', res);
    // 3.2) extract BOC of the signed external-in message
    const inMessageBoc = res.boc;
    if (!inMessageBoc) {
      alert('❌ Não recebi o BOC da mensagem para confirmação.');
      return;
    }

    // 3.3) register with backend; worker fará polling
    const markRes = await fetch('/api/markPaid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pendingPaymentId: p.id,
        inMessageBoc,
        walletAddress
      }),
    })
    if (!markRes.ok) {
      console.error(await markRes.text());
      alert('❌ Erro ao registrar pagamento. Tente novamente.');
      return;
    }

    alert('✅ Pagamento enviado! Aguardando confirmação on-chain.');
  };

  if (loading || !members.length) return <p>Carregando detalhes da bag…</p>;
  if (error)                       return <p>Erro: {error}</p>;

  return (
    <div className="p-4 space-y-6 min-h-screen" style={{ backgroundColor:'#000', color:'#fff' }}>
      {!walletAddress && (
        <div className="bg-yellow-800 text-yellow-100 rounded-lg p-3">
          ❗ Conecte sua carteira em&nbsp;
          <a href="/perfil" className="underline font-semibold">seu perfil</a>.
        </div>
      )}

      <h1 className="text-3xl font-bold text-center">{bagName}</h1>

      {pendingPayments.length > 0 && (
        <div className="bg-white text-black rounded-xl p-4 space-y-3">
          <h2 className="text-xl font-bold">💰 Você deve:</h2>
          {pendingPayments.map((p, idx) => {
            const disabled = !walletAddress || p.txHash || p.user_to_address;
            const feeBrl   = p.valor_brl * feeNum / feeDen;
            const totalBrl = p.valor_brl + feeBrl;
            const totalTon = p.valor_ton * (1 + feeNum/feeDen);
            return (
              <div key={idx} className="flex justify-between items-center border rounded-lg px-3 py-2">
                <div>
                  <p className="font-medium">
                    R$ {p.valor_brl.toFixed(2)} + R$ {feeBrl.toFixed(2)} = R$ {totalBrl.toFixed(2)}{' '}
                    (≈ {totalTon.toFixed(3)} TON)
                  </p>
                  <p className="text-sm text-gray-700">Para: {p.para.nome}</p>
                </div>
                <button
                  onClick={() => handlePay(p)}
                  disabled={disabled}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Pagar
                </button>
              </div>
            );
          })}
          <p className="text-xs text-gray-500 mt-1">
            Cotação: 1 TON ≈ R$ {cotacaoTon.toFixed(2)}
          </p>
        </div>
      )}

      {members[0] && <MemberCard member={members[0]} highlight fullWidth />}
      <div className="grid grid-cols-3 gap-3">
        {members.slice(1).map(m => (
          <MemberCard key={m.id} member={m} highlight={false} />
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-6">Transações</h2>
      <div className="space-y-4">
        {txs.map(t => (
          <TransactionItem key={t.id} tx={t} theme="dark" />
        ))}
      </div>
    </div>
  );
}
