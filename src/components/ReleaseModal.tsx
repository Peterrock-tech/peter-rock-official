import { useEffect } from 'react';
import { ArrowUpRight, Disc3, Pause, Play, X } from 'lucide-react';
import { Release, Track } from '../data/artistData';
import { ResilientImage } from './ResilientImage';

interface ReleaseModalProps {
  release: Release | null;
  currentTrackId: string | null;
  isPlaying: boolean;
  onClose: () => void;
  onPlayTrack: (track: Track) => void;
}

export function ReleaseModal({
  release,
  currentTrackId,
  isPlaying,
  onClose,
  onPlayTrack,
}: ReleaseModalProps) {
  useEffect(() => {
    if (!release) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [release, onClose]);

  if (!release) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040812]/85 p-4 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="release-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-blue-200/15 bg-[#0B1324] p-5 sm:p-8 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close release details"
          className="absolute right-4 top-4 sm:right-5 sm:top-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200/15 bg-[#121D38] text-slate-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <div>
            <div className="aspect-square overflow-hidden rounded-xl border border-blue-200/15 bg-[#070D1B]">
              <ResilientImage
                src={release.coverUrl}
                alt={`${release.title} cover art by Peter Rock`}
                fallbackTitle={release.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-5 space-y-2 border-t border-white/12 pt-4 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Catalog</span>
                <span className="font-mono text-white tabular-nums">{release.catalogNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Artist</span>
                <span className="text-white">Peter Rock</span>
              </div>
              <div className="flex justify-between">
                <span>Runtime</span>
                <span className="font-mono text-white tabular-nums">{release.runtime}</span>
              </div>
              <div className="pt-2">
                <span className="block text-slate-400 mb-1.5">Stream Everywhere</span>
                {release.smartLinkUrl && (
                  <a
                    href={release.smartLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2 flex w-full items-center justify-between rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
                  >
                    <span>Open Official Song Link</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                  </a>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {release.streamingLinks
                    .filter((item) => item.url !== release.smartLinkUrl)
                    .map((item) => (
                      <a
                        key={item.platform}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded-lg border border-blue-200/15 bg-[#070D1B] px-2.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-[#3B82F6] hover:text-white"
                      >
                        <span className="truncate">{item.platform}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pr-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-blue-300">
              <span>{release.category}</span>
              <span aria-hidden="true">·</span>
              <span>{release.format}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{release.year}</span>
            </div>

            <h2
              id="release-modal-title"
              className="mt-2 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white"
            >
              {release.title}
            </h2>

            <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-slate-200">
              {release.synopsis}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{release.linerNotes}</p>

            <div className="mt-6 border-t border-white/12 pt-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold tracking-wide text-slate-300">
                  12-Second Chorus Preview
                </h3>
                <button
                  type="button"
                  onClick={() => onPlayTrack(release.tracks[0])}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap cursor-pointer"
                >
                  <Disc3 className="w-3.5 h-3.5" />
                  Play 12s Clip
                </button>
              </div>

              <div className="divide-y divide-white/10">
                {release.tracks.map((track) => {
                  const isActive = currentTrackId === track.id;
                  const activePlaying = isActive && isPlaying;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => onPlayTrack(track)}
                      className={`group flex w-full items-center justify-between gap-4 py-3 px-2 text-left transition-colors rounded-lg cursor-pointer ${
                        isActive ? 'bg-[#0E1B38]' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-xs transition-colors ${
                            isActive
                              ? 'border-[#2563EB] bg-[#2563EB] text-white'
                              : 'border-white/15 bg-[#04060A] text-slate-300 group-hover:border-blue-400 group-hover:text-white'
                          }`}
                        >
                          {activePlaying ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5 ml-0.5" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-400 tabular-nums">
                              {track.number}
                            </span>
                            <span
                              className={`truncate text-sm font-medium ${
                                isActive ? 'text-white' : 'text-slate-100'
                              }`}
                            >
                              {track.title}
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-400 mt-0.5">
                            {track.instrumentation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-xs text-slate-300 font-mono tabular-nums">
                        <span className="hidden sm:inline text-blue-300">
                          {track.previewDurationSec}s clip
                        </span>
                        <span>{track.durationLabel}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-5 border-t border-white/12 pt-4 text-xs text-slate-400">
              {release.credits}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
