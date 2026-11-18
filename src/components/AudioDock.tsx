import { ArrowUpRight, Pause, Play, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { Track } from '../data/artistData';
import { ResilientImage } from './ResilientImage';

interface AudioDockProps {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (sec: number) => void;
  onVolumeChange: (val: number) => void;
  onClose: () => void;
}

export function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function AudioDock({
  track,
  isPlaying,
  currentTime,
  volume,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onClose,
}: AudioDockProps) {
  if (!track) return null;

  return (
    <aside
      aria-label="Audio player"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-200/15 bg-[#070D1B]/95 backdrop-blur-md"
    >
      {/* Mobile-only interactive top scrubber bar */}
      <div className="sm:hidden px-4 pt-1.5 flex items-center gap-2">
        <span className="font-mono text-[10px] text-slate-300 tabular-nums w-8">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={track.previewDurationSec}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Mobile audio position"
          className="audio-range flex-1"
        />
        <span className="font-mono text-[10px] text-slate-400 tabular-nums w-8 text-right">
          {track.previewDurationLabel}
        </span>
      </div>

      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-2.5 sm:gap-4 px-4 sm:px-6 lg:px-10">
        {/* Track Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial sm:w-64">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-blue-200/15">
            <ResilientImage
              src={track.coverUrl}
              alt={track.releaseTitle}
              fallbackTitle={track.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs sm:text-sm font-medium text-white">{track.title}</p>
            <p className="truncate text-[11px] sm:text-xs text-blue-300">
              {track.previewDurationSec}s Highlight · {track.durationLabel}
            </p>
          </div>
        </div>

        {/* Transport & Scrubber */}
        <div className="flex items-center gap-2 sm:gap-3 sm:flex-1 sm:max-w-md shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous track"
              className="inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause track' : 'Play track'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white transition-transform duration-150 hover:bg-[#1D4ED8] active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next track"
              className="inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex flex-1 items-center gap-2.5">
            <span className="font-mono text-[11px] text-slate-300 tabular-nums w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={track.previewDurationSec}
              step={0.1}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              aria-label="Seek audio position"
              className="audio-range flex-1"
            />
            <span className="font-mono text-[11px] text-slate-400 tabular-nums w-10">
              {track.previewDurationLabel}
            </span>
          </div>
        </div>

        {/* Stream Link, Volume & Dismiss */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {track.smartLinkUrl && (
            <a
              href={track.smartLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-blue-400/35 bg-[#0D172E] px-2.5 py-1.5 text-xs font-semibold text-blue-300 transition-colors hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white whitespace-nowrap"
            >
              <span className="hidden sm:inline">Stream Full</span>
              <span className="sm:hidden">Stream</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
          <div className="hidden md:flex items-center gap-2 w-24">
            <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              aria-label="Master volume"
              className="audio-range w-full"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stop and close audio bar"
            className="inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
