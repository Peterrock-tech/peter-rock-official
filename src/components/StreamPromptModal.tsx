import { useEffect } from 'react';
import { ArrowUpRight, RotateCcw, X } from 'lucide-react';
import { Release, Track } from '../data/artistData';
import { ResilientImage } from './ResilientImage';

interface StreamPromptModalProps {
  release: Release | null;
  track: Track | null;
  onClose: () => void;
  onReplay: (track: Track) => void;
}

export function StreamPromptModal({
  release,
  track,
  onClose,
  onReplay,
}: StreamPromptModalProps) {
  useEffect(() => {
    if (!release) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [release, onClose]);

  if (!release || !track) return null;

  const primaryUrl = release.smartLinkUrl ?? release.streamingLinks[0]?.url;
  const secondaryLinks = release.streamingLinks.filter((item) => item.url !== primaryUrl);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#040812]/85 p-4 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stream-prompt-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-blue-200/15 bg-[#0B1324] p-6 sm:p-7 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close streaming prompt"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200/15 bg-[#121D38] text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-4 pr-8">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-blue-200/15 bg-[#070D1B]">
            <ResilientImage
              src={release.coverUrl}
              alt={`${release.title} cover art`}
              fallbackTitle={release.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-blue-400">
              {track.previewDurationSec}s Highlight Complete
            </p>
            <h2
              id="stream-prompt-title"
              className="mt-1 font-display text-xl sm:text-2xl font-semibold tracking-tight text-white leading-tight"
            >
              {release.title}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Peter Rock · Full Track {release.runtime}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-300">
          Listen to the full song on your preferred streaming platform now.
        </p>

        {primaryUrl && (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#2563EB] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
          >
            <span>{release.smartLinkLabel ?? 'Stream Full Song'}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </a>
        )}

        {secondaryLinks.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-medium text-slate-400 mb-2">Or choose a platform</p>
            <div className="grid grid-cols-2 gap-2">
              {secondaryLinks.slice(0, 6).map((item) => (
                <a
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between rounded-lg border border-blue-200/15 bg-[#070D1B] px-3 py-2.5 text-xs font-medium text-slate-200 transition-colors hover:border-[#3B82F6] hover:text-white"
                >
                  <span className="truncate">{item.platform}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/12 pt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onReplay(track);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-blue-400" />
            Replay {track.previewDurationSec}s Clip
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
