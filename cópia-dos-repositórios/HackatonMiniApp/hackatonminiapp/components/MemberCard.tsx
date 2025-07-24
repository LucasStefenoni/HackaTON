export default function MemberCard({ member, highlight, fullWidth }: { member: any; highlight?: boolean; fullWidth?: boolean }) {
  return (
    <div
      className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col space-y-2 ${fullWidth
        ? 'w-full bg-gradient-to-l from-slate-900 to-blue-900 shadow-lg text-center'
        : highlight
          ? 'bg-gradient-to-r from-cyan-900 to-gray-700 shadow-md'
          : 'bg-gradient-to-r from-blue-800 to-indigo-900 shadow-sm'
        }`}
    >
      <h3
        className={`text-base font-semibold truncate text-white`}
        title={member.name} // Adiciona tooltip para texto truncado
      >
        {member.name}
      </h3>
      <p
        className={`text-sm font-medium truncate ${member.total_spent >= 0 ? 'text-green-400' : 'text-red-400'}`}
        title={`R$ ${member.total_spent !== undefined ? member.total_spent.toFixed(2) : '0.00'}`} // Adiciona tooltip para valores truncados
      >
        R$ {member.total_spent !== undefined ? member.total_spent.toFixed(2) : '0.00'}
      </p>
    </div>
  );
}