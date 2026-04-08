'use client';

import React, { useState } from 'react';

interface BlogImageProps {
  src: string;
  alt: string;
  category: string;
  aspect?: string;
}

export default function BlogImage({ src, alt, category, aspect = 'aspect-[21/9]' }: BlogImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`w-full ${aspect} rounded-2xl mb-12 opacity-30 flex items-center justify-center border border-[var(--border)]`} style={{ background: `linear-gradient(135deg, var(--coral)33, transparent)` }}>
         <span className="text-6xl">{category === 'Nigeria' ? '🇳🇬' : '🛰️'}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspect} rounded-2xl overflow-hidden mb-12 shadow-2xl border border-[var(--border)] bg-[var(--surface)]`}>
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  );
}
