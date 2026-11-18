import { Track } from '../data/artistData';

type Listener = () => void;

/**
 * Real HTMLAudioElement + Web Audio Analyser engine for Peter Rock's song highlights.
 * Streams the 12-second chorus/main section preview clips while exposing real-time
 * FFT spectrum telemetry and notifying listeners when the preview ends so the
 * full-song streaming link popup can open automatically.
 */
class ArtistAudioEngine {
  private audioEl: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceConnected = false;

  private currentTrack: Track | null = null;
  private isPlaying = false;
  private volume = 0.85;
  private progressTimer: number | null = null;
  private listeners: Set<Listener> = new Set();
  private onTrackEndedCb: ((finishedTrack: Track) => void) | null = null;

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public setOnTrackEnded(cb: (finishedTrack: Track) => void): void {
    this.onTrackEndedCb = cb;
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  private ensureAudio(): void {
    if (!this.audioEl) {
      this.audioEl = new Audio();
      this.audioEl.preload = 'auto';
      this.audioEl.crossOrigin = 'anonymous';

      this.audioEl.addEventListener('ended', () => {
        const finished = this.currentTrack;
        this.isPlaying = false;
        this.stopProgressLoop();
        if (this.audioEl) {
          this.audioEl.currentTime = finished?.previewDurationSec ?? 0;
        }
        this.notify();
        if (finished && this.onTrackEndedCb) {
          this.onTrackEndedCb(finished);
        }
      });

      this.audioEl.addEventListener('pause', () => {
        if (this.isPlaying && this.audioEl && !this.audioEl.ended) {
          this.isPlaying = false;
          this.stopProgressLoop();
          this.notify();
        }
      });
    }

    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.value = this.volume;

          this.analyser = this.ctx.createAnalyser();
          this.analyser.fftSize = 128;
          this.analyser.smoothingTimeConstant = 0.8;

          if (!this.sourceConnected && this.audioEl) {
            const mediaSource = this.ctx.createMediaElementSource(this.audioEl);
            mediaSource.connect(this.masterGain);
            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.ctx.destination);
            this.sourceConnected = true;
          }
        }
      } catch {
        // Fallback safely to native audioEl volume if AudioContext routing is unavailable
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  public getState() {
    return {
      currentTrack: this.currentTrack,
      isPlaying: this.isPlaying,
      volume: this.volume,
      currentTime: this.getCurrentTime(),
    };
  }

  public getCurrentTime(): number {
    if (!this.currentTrack || !this.audioEl) return 0;
    return Math.min(this.audioEl.currentTime || 0, this.currentTrack.previewDurationSec);
  }

  public getFrequencyData(target: Uint8Array<ArrayBuffer>): boolean {
    if (!this.analyser || !this.isPlaying) {
      return false;
    }
    this.analyser.getByteFrequencyData(target);
    return true;
  }

  public setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.03);
    } else if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
    this.notify();
  }

  public playTrack(track: Track, forceRestart = false): void {
    this.ensureAudio();
    if (!this.audioEl) return;

    if (this.currentTrack?.id === track.id && !forceRestart) {
      if (this.isPlaying) {
        this.pause();
        return;
      }
      if (
        this.audioEl.ended ||
        this.audioEl.currentTime >= Math.max(0.2, track.previewDurationSec - 0.15)
      ) {
        this.audioEl.currentTime = 0;
      }
      this.resume();
      return;
    }

    this.stopProgressLoop();
    this.currentTrack = track;
    this.audioEl.pause();
    this.audioEl.src = track.previewUrl;
    this.audioEl.currentTime = 0;
    if (!this.sourceConnected) {
      this.audioEl.volume = this.volume;
    }
    this.startPlayback();
  }

  public pause(): void {
    if (!this.audioEl || !this.isPlaying) return;
    this.isPlaying = false;
    this.audioEl.pause();
    this.stopProgressLoop();
    this.notify();
  }

  public resume(): void {
    if (!this.currentTrack || !this.audioEl || this.isPlaying) return;
    this.ensureAudio();
    if (this.audioEl.currentTime >= Math.max(0.2, this.currentTrack.previewDurationSec - 0.15)) {
      this.audioEl.currentTime = 0;
    }
    this.startPlayback();
  }

  public stop(): void {
    this.stopProgressLoop();
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
    this.isPlaying = false;
    this.currentTrack = null;
    this.notify();
  }

  public seek(seconds: number): void {
    if (!this.currentTrack || !this.audioEl) return;
    const clamped = Math.max(0, Math.min(seconds, this.currentTrack.previewDurationSec));
    this.audioEl.currentTime = clamped;
    this.notify();
  }

  private startPlayback(): void {
    if (!this.audioEl || !this.currentTrack) return;
    this.isPlaying = true;
    this.notify();

    void this.audioEl.play().catch(() => {
      this.isPlaying = false;
      this.stopProgressLoop();
      this.notify();
    });

    this.stopProgressLoop();
    this.progressTimer = window.setInterval(() => {
      this.notify();
    }, 100);
  }

  private stopProgressLoop(): void {
    if (this.progressTimer !== null) {
      window.clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }
}

export const audioEngine = new ArtistAudioEngine();
