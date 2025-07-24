// app/create/page.tsx
import { Suspense } from 'react';
import CreateBagClient from './CreateBagClient';

export default function CreatePage() {
  return (
    <Suspense fallback={<p className="p-4">Carregando…</p>}>
      <CreateBagClient />
    </Suspense>
  );
}
