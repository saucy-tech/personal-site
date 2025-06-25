'use client';

import dynamic from 'next/dynamic';

// Client-only TipJar component
const TipJar = dynamic(() => import('@/components/TipJar'), { ssr: false });

export default function ClientTipJar() {
  return <TipJar />;
}
