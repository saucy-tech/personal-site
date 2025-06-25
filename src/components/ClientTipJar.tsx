'use client';

import dynamic from 'next/dynamic';

const TipJar = dynamic(() => import('@/components/TipJar'), { ssr: false });

export default function ClientTipJar() {
  return <TipJar />;
}
