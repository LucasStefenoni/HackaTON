'use client';

export default function TransactionItem({ tx, theme }: { tx: any; theme: 'dark' | 'light' }) {
  return (
    <div
      className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col space-y-2 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800' // Tema escuro corrigido
          : 'bg-gradient-to-r from-neutral-700 to-neutral-900 text-white' // Tema claro corrigido
      }`}
    >
      <h4 className="text-lg font-bold">{tx.message_text}</h4>
      <div className="flex justify-between items-center text-sm">
        <p>
          Por: <span className="font-medium">{tx.user_name}</span>
        </p>
        <p>{new Date(tx.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}