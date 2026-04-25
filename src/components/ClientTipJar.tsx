'use client';

import dynamic from 'next/dynamic';

// Client-only TipJar component
const TipJar = dynamic(() => import('@/components/TipJar'), { ssr: false });

interface ClientTipJarProps {
  initialMemo?: string;
}

export default function ClientTipJar({ initialMemo }: ClientTipJarProps) {
  return <TipJar initialMemo={initialMemo} />;
}
