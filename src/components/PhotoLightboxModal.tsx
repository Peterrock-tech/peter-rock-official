import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryPhoto } from '../data/artistData';
import { ResilientImage } from './ResilientImage';

interface PhotoLightboxModalProps {
  photos: GalleryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
}

export function PhotoLightboxModal({
  photos,
  activeIndex,
  onClose,
  onChangeIndex,
}: PhotoLightboxModalProps) {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onChangeIndex((activeIndex - 1 + photos.length) % photos.length);
      }
      if (e.key === 'ArrowRight') {
        onChangeIndex((activeIndex + 1) % photos.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, photos.length, onClose, onChangeIndex]);

  if (activeIndex === null || !photos[activeIndex]) return null;
  const photo = photos[activeIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040812]/92 p-4 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-photo-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-blue-200/15 bg-[#0B1324] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-[#070D1B]/85 text-white hover:bg-[#2563EB] hover:border-[#2563EB] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className="relative flex max-h-[68vh] sm:max-h-[72vh] items-center justify-center bg-[#050914] select-none"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(deltaX) > 40) {
              if (deltaX > 0) {
                onChangeIndex((activeIndex - 1 + photos.length) % photos.length);
              } else {
                onChangeIndex((activeIndex + 1) % photos.length);
              }
            }
          }}
        >
          <ResilientImage
            src={photo.src}
            alt={photo.title}
            fallbackTitle={photo.title}
            className="max-h-[68vh] sm:max-h-[72vh] w-auto max-w-full object-contain"
          />

          <button
            type="button"
            onClick={() => onChangeIndex((activeIndex - 1 + photos.length) % photos.length)}
            aria-label="Previous photograph"
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#070D1B]/80 text-white hover:bg-[#2563EB] hover:border-[#2563EB] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => onChangeIndex((activeIndex + 1) % photos.length)}
            aria-label="Next photograph"
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#070D1B]/80 text-white hover:bg-[#2563EB] hover:border-[#2563EB] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-t border-blue-200/12 px-5 py-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-blue-400 font-medium">{photo.context}</p>
            <h3 id="lightbox-photo-title" className="font-display text-lg font-semibold text-white">
              {photo.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{photo.caption}</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-1.5" role="group" aria-label="Select photograph">
              {photos.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChangeIndex(idx)}
                  aria-label={`View photo ${idx + 1}: ${p.title}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeIndex ? 'w-6 bg-[#2563EB]' : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-slate-400 tabular-nums shrink-0">
              {activeIndex + 1} / {photos.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
