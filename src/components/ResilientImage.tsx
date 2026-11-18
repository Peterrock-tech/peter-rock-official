import { useState } from 'react';
import { Disc3 } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export function ResilientImage({ src, alt, fallbackTitle, className = '' }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B1C42] via-[#04060A] to-[#081229] border border-blue-500/25 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/40 bg-[#2563EB]/15">
          <Disc3 className="h-6 w-6 text-white" strokeWidth={1.5} />
        </div>
        <span className="font-display text-base font-semibold tracking-tight text-white">
          {fallbackTitle}
        </span>
        <span className="mt-1 font-mono text-[11px] tracking-wider text-blue-300">
          Peter Rock Official
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
