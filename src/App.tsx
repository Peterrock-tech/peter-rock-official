import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Disc3,
  Expand,
  Pause,
  Phone,
  Play,
  SkipBack,
  SkipForward,
  Ticket,
} from 'lucide-react';
import { audioEngine } from './audio/synthEngine';
import { AudioDock, formatTime } from './components/AudioDock';
import { PhotoLightboxModal } from './components/PhotoLightboxModal';
import { ReleaseModal } from './components/ReleaseModal';
import { ResilientImage } from './components/ResilientImage';
import { SpectrumVisualizer } from './components/SpectrumVisualizer';
import { StreamPromptModal } from './components/StreamPromptModal';
import { TicketModal } from './components/TicketModal';
import { TopBar } from './components/TopBar';
import {
  ALL_TRACKS,
  ARTIST_ASSETS,
  FACEBOOK_PAGE_URL,
  GALLERY_PHOTOS,
  INSTAGRAM_URL,
  OFFICIAL_SMARTLINKS,
  PERSONAL_PROFILE,
  PRESS_QUOTES,
  PROOF_METRICS,
  RELEASES,
  Release,
  ReleaseCategory,
  TOUR_DATES,
  TourDate,
  Track,
  YOUTUBE_CHANNEL_URL,
} from './data/artistData';

type DiscographyFilter = 'All' | ReleaseCategory;
type TourFilter = 'upcoming' | 'archive';
type LinkFilter = 'all' | 'song' | 'social';
type InquiryType = 'Worship Night / Church' | 'Concert / Festival' | 'Feature Collaboration' | 'Press & Media';

const DISCOGRAPHY_FILTERS: DiscographyFilter[] = [
  'All',
  'Worship Singles',
  'Acoustic Sessions',
  'Gospel Ballads',
];

const INQUIRY_TYPES: InquiryType[] = [
  'Worship Night / Church',
  'Concert / Festival',
  'Feature Collaboration',
  'Press & Media',
];

export default function App() {
  // Audio engine state
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.78);

  // Interactive UI filters & modals
  const [releaseFilter, setReleaseFilter] = useState<DiscographyFilter>('All');
  const [tourFilter, setTourFilter] = useState<TourFilter>('upcoming');
  const [linkFilter, setLinkFilter] = useState<LinkFilter>('all');
  const [inspectedRelease, setInspectedRelease] = useState<Release | null>(null);
  const [selectedTourDate, setSelectedTourDate] = useState<TourDate | null>(null);
  const [streamPromptTrack, setStreamPromptTrack] = useState<Track | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Booking / inquiry form state
  const [inquiryType, setInquiryType] = useState<InquiryType>('Worship Night / Church');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [projectWindow, setProjectWindow] = useState('');
  const [inquiryBrief, setInquiryBrief] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const bookingSectionRef = useRef<HTMLElement | null>(null);

  // Subscribe to Web Audio engine updates
  useEffect(() => {
    const sync = () => {
      const s = audioEngine.getState();
      setActiveTrack(s.currentTrack);
      setIsPlaying(s.isPlaying);
      setCurrentTime(s.currentTime);
      setVolume(s.volume);
    };

    const handleEnded = (finishedTrack: Track) => {
      setStreamPromptTrack(finishedTrack);
    };

    audioEngine.setOnTrackEnded(handleEnded);
    const unsub = audioEngine.subscribe(sync);
    return () => {
      unsub();
    };
  }, []);

  const displayedTrack = activeTrack ?? ALL_TRACKS[0];

  const streamPromptRelease = useMemo(
    () => RELEASES.find((r) => r.id === streamPromptTrack?.releaseId) ?? null,
    [streamPromptTrack],
  );

  const filteredReleases = useMemo(() => {
    if (releaseFilter === 'All') return RELEASES;
    return RELEASES.filter((r) => r.category === releaseFilter);
  }, [releaseFilter]);

  const filteredTourDates = useMemo(() => {
    return TOUR_DATES.filter((t) => (tourFilter === 'upcoming' ? t.isUpcoming : !t.isUpcoming));
  }, [tourFilter]);

  const filteredLinks = useMemo(() => {
    if (linkFilter === 'all') return OFFICIAL_SMARTLINKS;
    return OFFICIAL_SMARTLINKS.filter((item) => item.category === linkFilter);
  }, [linkFilter]);

  const handlePlayTrack = (track: Track, forceRestart = false) => {
    setStreamPromptTrack(null);
    audioEngine.playTrack(track, forceRestart);
  };

  const handleToggleDisplayTrack = () => {
    if (activeTrack) {
      if (isPlaying) {
        audioEngine.pause();
      } else {
        setStreamPromptTrack(null);
        audioEngine.resume();
      }
    } else {
      setStreamPromptTrack(null);
      audioEngine.playTrack(displayedTrack);
    }
  };

  const handleStepTrack = (direction: -1 | 1) => {
    setStreamPromptTrack(null);
    const base = activeTrack ?? ALL_TRACKS[0];
    const idx = ALL_TRACKS.findIndex((t) => t.id === base.id);
    const nextIdx = (idx + direction + ALL_TRACKS.length) % ALL_TRACKS.length;
    audioEngine.playTrack(ALL_TRACKS[nextIdx]);
  };

  const scrollToBooking = () => {
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopySmartLink = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinkId(id);
      window.setTimeout(() => setCopiedLinkId(null), 2000);
    } catch {
      setCopiedLinkId(null);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('peterrock.1999@gmail.com');
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('08140775771');
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2200);
    } catch {
      setCopiedPhone(false);
    }
  };

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !inquiryBrief.trim()) return;
    setInquirySubmitted(true);
  };

  const heroTrack = ALL_TRACKS[0];
  const heroProgress =
    activeTrack?.id === heroTrack.id
      ? Math.min(100, (currentTime / heroTrack.previewDurationSec) * 100)
      : 0;

  return (
    <MotionConfig reducedMotion="user">
      <div
        id="top"
        className={`min-h-screen bg-[#070D1B] text-white ${activeTrack ? 'pb-28 sm:pb-20' : ''}`}
      >
        <TopBar onBookClick={scrollToBooking} />

        <main>
          {/* 1. SPLIT-SCREEN HERO + FULL-WIDTH PROOF STRIP (MIDNIGHT SAPPHIRE & ROYAL COBALT) */}
          <section className="relative overflow-hidden bg-[radial-gradient(ellipse_75%_55%_at_78%_12%,rgba(37,99,235,0.22),transparent_65%),radial-gradient(ellipse_55%_45%_at_12%_88%,rgba(59,130,246,0.12),transparent_60%)]">
            <div className="mx-auto max-w-[1280px] px-5 pt-8 pb-12 sm:px-6 lg:px-10 lg:pt-14">
              <div className="grid items-stretch gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
                {/* Hero Copy Column */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-between lg:col-span-7 py-1 sm:py-2"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-blue-400">
                      <span>Nigerian Gospel Musician</span>
                      <span aria-hidden="true" className="text-slate-500">
                        ·
                      </span>
                      <span className="text-slate-300">Songwriter &amp; Music Minister</span>
                    </div>

                    <h1
                      style={{ textWrap: 'balance' }}
                      className="mt-4 sm:mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.06]"
                    >
                      Music with a message, worship with a purpose, and a sound that carries His
                      presence.
                    </h1>

                    <p className="mt-5 sm:mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
                      <strong className="font-semibold text-white">Peter Rock</strong> is a gospel
                      musician, songwriter, worshipper, and multi-talented instrumentalist. Stream
                      his official releases worldwide—
                      <span className="text-white font-medium">Better Than Wine</span>,{' '}
                      <span className="text-white font-medium">
                        Where He Leads (Acoustic Version)
                      </span>
                      , and <span className="text-white font-medium">Hold My Hands</span>.
                    </p>
                  </div>

                  <div className="mt-7 sm:mt-8 pt-6 border-t border-blue-200/12 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <a
                        href="#discography"
                        className="inline-flex min-h-[44px] flex-1 sm:flex-initial items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#1D4ED8] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
                      >
                        <Disc3 className="h-4 w-4" />
                        Stream All Releases
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          activeTrack?.id === heroTrack.id && isPlaying
                            ? audioEngine.pause()
                            : handlePlayTrack(heroTrack)
                        }
                        className="inline-flex min-h-[44px] flex-1 sm:flex-initial items-center justify-center gap-2 rounded-lg border border-blue-200/20 bg-[#0D172E] px-4 py-3 text-sm font-medium text-white transition-all duration-150 hover:border-white hover:bg-white hover:text-[#070D1B] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {activeTrack?.id === heroTrack.id && isPlaying ? (
                          <>
                            <Pause className="h-4 w-4 text-blue-400" />
                            Pause Preview
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 text-blue-400" />
                            Play 12s Chorus
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pt-1">
                      <a
                        href={YOUTUBE_CHANNEL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[36px] items-center gap-1 text-xs sm:text-sm font-medium text-slate-300 transition-colors hover:text-blue-400 whitespace-nowrap shrink-0"
                      >
                        YouTube @peterrock449
                        <ArrowUpRight className="h-4 w-4 text-blue-400" />
                      </a>

                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[36px] items-center gap-1 text-xs sm:text-sm font-medium text-slate-300 transition-colors hover:text-blue-400 whitespace-nowrap shrink-0"
                      >
                        Instagram
                        <ArrowUpRight className="h-4 w-4 text-blue-400" />
                      </a>

                      <a
                        href={FACEBOOK_PAGE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[36px] items-center gap-1 text-xs sm:text-sm font-medium text-slate-300 transition-colors hover:text-blue-400 whitespace-nowrap shrink-0"
                      >
                        Facebook
                        <ArrowUpRight className="h-4 w-4 text-blue-400" />
                      </a>

                      <a
                        href="#biography"
                        className="inline-flex min-h-[36px] items-center gap-1 text-xs sm:text-sm font-medium text-slate-400 transition-colors hover:text-white whitespace-nowrap shrink-0"
                      >
                        Biography
                        <ArrowUpRight className="h-4 w-4 text-slate-500" />
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Hero Portrait Column with Interactive Quick-Play Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-5"
                >
                  <div className="group relative h-full min-h-[380px] sm:min-h-[430px] lg:min-h-[490px] overflow-hidden rounded-2xl border border-blue-200/18 bg-[#0D172E] shadow-2xl">
                    <ResilientImage
                      src={ARTIST_ASSETS.studioPortraitArmsFolded}
                      alt="Official studio portrait of gospel musician Peter Rock"
                      fallbackTitle="Peter Rock Official"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060B16]/95 via-[#060B16]/25 to-transparent" />

                    {/* Interactive Quick-Play Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-blue-200/18 bg-[#070D1B]/90 p-3.5 backdrop-blur-md">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-blue-400">
                            Featured 12s Highlight
                          </p>
                          <p className="truncate text-sm font-semibold text-white">
                            {heroTrack.title}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            activeTrack?.id === heroTrack.id && isPlaying
                              ? audioEngine.pause()
                              : handlePlayTrack(heroTrack)
                          }
                          aria-label={
                            activeTrack?.id === heroTrack.id && isPlaying
                              ? `Pause ${heroTrack.title}`
                              : `Play ${heroTrack.title} 12-second chorus`
                          }
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white transition-transform hover:bg-[#1D4ED8] active:scale-95 cursor-pointer"
                        >
                          {activeTrack?.id === heroTrack.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" />
                          )}
                        </button>
                      </div>

                      <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/15">
                        <div
                          className="h-full bg-[#3B82F6] transition-all duration-150"
                          style={{ width: `${heroProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Full-Width 4-Column Proof Strip */}
              <div className="mt-10 sm:mt-12 grid grid-cols-2 border-y border-blue-200/12 lg:grid-cols-4">
                {PROOF_METRICS.map((metric, idx) => (
                  <div
                    key={metric.label}
                    className={`py-4 sm:py-5 px-3 sm:px-6 ${
                      idx % 2 === 1 ? 'border-l border-blue-200/12' : ''
                    } ${idx >= 2 ? 'border-t border-blue-200/12 lg:border-t-0 lg:border-l' : ''}`}
                  >
                    <p className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-blue-400 tabular-nums">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-white">{metric.label}</p>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-slate-400">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        {/* ROYAL BLUE EDITORIAL MARQUEE DIVIDER */}
        <div
          className="overflow-hidden border-y border-blue-400/30 bg-[#1D4ED8] py-3 select-none"
          aria-hidden="true"
        >
          <div className="animate-marquee text-xs font-mono tracking-widest text-white">
            <span className="mx-6">
              peter rock official · better than wine · where he leads (acoustic version) · hold my
              hands
            </span>
            <span className="mx-6">
              peter rock official · better than wine · where he leads (acoustic version) · hold my
              hands
            </span>
          </div>
        </div>

        {/* 2. DISCOGRAPHY SHOWCASE — SOFT ICE PORCELAIN SURFACE */}
        <section
          id="discography"
          className="bg-[#F3F6FC] text-[#0A1122] py-14 sm:py-16 lg:py-20"
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1D4ED8]">
                  Official Catalog · Out Everywhere
                </p>
                <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0A1122]">
                  Released Singles
                </h2>
              </div>

              <div
                role="group"
                aria-label="Filter singles by style"
                className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-xs"
              >
                {DISCOGRAPHY_FILTERS.map((category) => {
                  const active = releaseFilter === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setReleaseFilter(category)}
                      className={`rounded-md px-3 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#070D1B] text-white'
                          : 'text-slate-600 hover:text-[#0A1122]'
                      }`}
                    >
                      {category === 'All' ? `All Releases (${RELEASES.length})` : category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredReleases.map((release) => {
                const isReleaseActive = activeTrack?.releaseId === release.id;
                const isReleasePlaying = isPlaying && isReleaseActive;
                const cardProgress = isReleaseActive
                  ? Math.min(100, (currentTime / release.tracks[0].previewDurationSec) * 100)
                  : 0;

                return (
                  <motion.article
                    key={release.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.35 }}
                    className={`group flex flex-col gap-5 rounded-2xl border bg-white p-5 transition-all duration-200 shadow-xs hover:shadow-md ${
                      isReleaseActive
                        ? 'border-[#2563EB] ring-1 ring-[#2563EB]/25'
                        : 'border-slate-200/90 hover:border-[#2563EB]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setInspectedRelease(release)}
                      className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[#070D1B] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                      aria-label={`Open streaming links and details for ${release.title}`}
                    >
                      <ResilientImage
                        src={release.coverUrl}
                        alt={`${release.title} cover art by Peter Rock`}
                        fallbackTitle={release.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      {isReleaseActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
                          <div
                            className="h-full bg-[#3B82F6] transition-all duration-150"
                            style={{ width: `${cardProgress}%` }}
                          />
                        </div>
                      )}
                    </button>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="font-medium text-[#1D4ED8]">{release.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{release.format}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{release.year}</span>
                        </div>

                        <h3 className="mt-1.5 font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#0A1122]">
                          {release.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {release.synopsis}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-mono tabular-nums">
                          <span>{release.catalogNumber}</span>
                          <span aria-hidden="true">/</span>
                          <span>{release.runtime}</span>
                          <span aria-hidden="true">/</span>
                          <span>{release.tracks[0].synth.musicalKey}</span>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                        <div className="flex items-center gap-2">
                          {release.smartLinkUrl ? (
                            <a
                              href={release.smartLinkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white transition-all duration-150 hover:bg-[#1D4ED8] active:scale-[0.98] whitespace-nowrap shrink-0"
                            >
                              Stream Now
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setInspectedRelease(release)}
                              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white transition-all duration-150 hover:bg-[#1D4ED8] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              Stream Platforms
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              isReleasePlaying
                                ? audioEngine.pause()
                                : handlePlayTrack(release.tracks[0])
                            }
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-[#0A1122] transition-all hover:border-[#070D1B] hover:bg-[#070D1B] hover:text-white active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            {isReleasePlaying ? (
                              <>
                                <Pause className="h-3.5 w-3.5 text-[#2563EB]" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 text-[#2563EB] ml-0.5" />
                                12s Clip
                              </>
                            )}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setInspectedRelease(release)}
                          className="min-h-[36px] text-xs font-semibold text-[#1D4ED8] transition-colors hover:text-[#0A1122] whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Liner Notes
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE LISTENING ROOM & OFFICIAL SONG LINKS (MIDNIGHT SAPPHIRE & BLUE) */}
        <section
          id="listening"
          className="border-y border-blue-200/12 bg-[#070D1B] text-white py-14 sm:py-16 lg:py-20"
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-400">
                  12s Main Part Highlight · Auto-Stream Prompt
                </p>
                <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                  Listening Room
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Hear a 12-second chorus highlight of any song—streaming links pop up automatically
                when it finishes.
              </p>
            </div>

            <div className="mt-8 sm:mt-9 grid gap-8 lg:grid-cols-12">
              {/* Active Deck */}
              <div className="lg:col-span-5 rounded-2xl border border-blue-200/15 bg-[#0D172E] p-5 sm:p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-blue-200/15 bg-[#070D1B]">
                      <ResilientImage
                        src={displayedTrack.coverUrl}
                        alt={displayedTrack.releaseTitle}
                        fallbackTitle={displayedTrack.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-blue-300">
                        Peter Rock · Track {displayedTrack.number}
                      </p>
                      <h3 className="mt-1 truncate font-display text-xl font-semibold text-white">
                        {displayedTrack.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {displayedTrack.instrumentation}
                      </p>
                      {displayedTrack.smartLinkUrl && (
                        <a
                          href={displayedTrack.smartLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
                        >
                          Open Full Song on Streaming Platforms
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-blue-200/12 bg-[#070D1B] p-4">
                    <SpectrumVisualizer isPlaying={isPlaying} barCount={36} className="h-20 w-full" />
                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                      <span>{displayedTrack.synth.musicalKey}</span>
                      <span>{displayedTrack.synth.bpm} BPM</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-blue-200/12">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-300 tabular-nums w-11">
                      {formatTime(activeTrack?.id === displayedTrack.id ? currentTime : 0)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={displayedTrack.previewDurationSec}
                      step={0.1}
                      value={activeTrack?.id === displayedTrack.id ? currentTime : 0}
                      onChange={(e) => {
                        if (!activeTrack) {
                          setStreamPromptTrack(null);
                          audioEngine.playTrack(displayedTrack);
                        }
                        audioEngine.seek(Number(e.target.value));
                      }}
                      aria-label="Track preview position"
                      className="audio-range flex-1"
                    />
                    <span className="font-mono text-xs text-slate-400 tabular-nums w-11 text-right">
                      {displayedTrack.previewDurationLabel}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStepTrack(-1)}
                        aria-label="Previous track"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200/15 text-slate-200 hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
                      >
                        <SkipBack className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleDisplayTrack}
                        className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#2563EB] px-5 text-xs font-semibold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4" />
                            Pause Clip
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 ml-0.5" />
                            Play 12s Clip
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStepTrack(1)}
                        aria-label="Next track"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200/15 text-slate-200 hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
                      >
                        <SkipForward className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {ALL_TRACKS.findIndex((t) => t.id === displayedTrack.id) + 1} /{' '}
                      {ALL_TRACKS.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tracklist (Mobile Card Stack + Desktop Table) + Filterable Links Hub */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-8">
                {/* Phone Touch Tracklist Cards */}
                <div className="space-y-3 md:hidden">
                  {ALL_TRACKS.map((track, idx) => {
                    const isCurrent = activeTrack?.id === track.id;
                    const rowPlaying = isCurrent && isPlaying;
                    const rowProgress = isCurrent
                      ? Math.min(100, (currentTime / track.previewDurationSec) * 100)
                      : 0;
                    return (
                      <div
                        key={track.id}
                        onClick={() =>
                          rowPlaying ? audioEngine.pause() : handlePlayTrack(track)
                        }
                        className={`relative overflow-hidden rounded-xl border p-3.5 transition-colors cursor-pointer ${
                          isCurrent
                            ? 'border-[#3B82F6] bg-[#132347]'
                            : 'border-blue-200/15 bg-[#0D172E]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (rowPlaying) {
                                  audioEngine.pause();
                                } else {
                                  handlePlayTrack(track);
                                }
                              }}
                              aria-label={
                                rowPlaying ? `Pause ${track.title}` : `Play ${track.title}`
                              }
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#2563EB] text-white'
                                  : 'bg-[#070D1B] text-slate-300 border border-blue-200/15'
                              }`}
                            >
                              {rowPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : isCurrent ? (
                                <Play className="h-4 w-4 ml-0.5" />
                              ) : (
                                <span className="font-mono text-xs">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                              )}
                            </button>

                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-blue-200/15">
                              <ResilientImage
                                src={track.coverUrl}
                                alt={track.title}
                                fallbackTitle={track.title}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {track.title}
                              </p>
                              <p className="text-[11px] font-mono text-slate-400">
                                {track.previewDurationLabel} clip · Full {track.durationLabel}
                              </p>
                            </div>
                          </div>

                          {track.smartLinkUrl && (
                            <a
                              href={track.smartLinkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex min-h-[38px] shrink-0 items-center gap-1 rounded-lg border border-blue-400/35 bg-[#070D1B] px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-[#2563EB] hover:text-white"
                            >
                              Listen
                              <ArrowUpRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        {isCurrent && (
                          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/15">
                            <div
                              className="h-full bg-[#3B82F6] transition-all duration-150"
                              style={{ width: `${rowProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table Tracklist */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-blue-200/12 text-xs font-medium text-slate-400">
                        <th className="py-3 pr-3 font-medium w-10">#</th>
                        <th className="py-3 pr-4 font-medium">Song Title</th>
                        <th className="py-3 pr-4 font-medium">Key / BPM</th>
                        <th className="py-3 pr-4 text-right font-medium">Length</th>
                        <th className="py-3 text-right font-medium">Stream</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-200/10 text-sm">
                      {ALL_TRACKS.map((track, idx) => {
                        const isCurrent = activeTrack?.id === track.id;
                        const rowPlaying = isCurrent && isPlaying;
                        return (
                          <tr
                            key={track.id}
                            onClick={() =>
                              rowPlaying ? audioEngine.pause() : handlePlayTrack(track)
                            }
                            className={`group cursor-pointer transition-colors ${
                              isCurrent ? 'bg-[#132347]' : 'hover:bg-white/5'
                            }`}
                          >
                            <td className="py-3.5 pr-3 font-mono text-xs tabular-nums">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (rowPlaying) {
                                    audioEngine.pause();
                                  } else {
                                    handlePlayTrack(track);
                                  }
                                }}
                                aria-label={
                                  rowPlaying ? `Pause ${track.title}` : `Play ${track.title}`
                                }
                                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#2563EB] text-white'
                                    : 'text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                                }`}
                              >
                                {rowPlaying ? (
                                  <Pause className="h-3.5 w-3.5" />
                                ) : isCurrent ? (
                                  <Play className="h-3.5 w-3.5 ml-0.5" />
                                ) : (
                                  <span>{String(idx + 1).padStart(2, '0')}</span>
                                )}
                              </button>
                            </td>
                            <td className="py-3.5 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-blue-200/15 bg-[#070D1B]">
                                  <ResilientImage
                                    src={track.coverUrl}
                                    alt={track.title}
                                    fallbackTitle={track.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p
                                    className={`font-medium ${
                                      isCurrent ? 'text-white' : 'text-slate-100 group-hover:text-white'
                                    }`}
                                  >
                                    {track.title}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    {track.instrumentation}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 pr-4 font-mono text-xs text-slate-300 tabular-nums">
                              {track.synth.musicalKey} · {track.synth.bpm}
                            </td>
                            <td className="py-3.5 pr-4 text-right font-mono text-xs text-slate-300 tabular-nums">
                              <span>{track.previewDurationLabel} clip</span>
                              <span className="block text-[10px] text-slate-500">
                                Full {track.durationLabel}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              {track.smartLinkUrl ? (
                                <a
                                  href={track.smartLinkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`Stream ${track.title} on all platforms`}
                                  className="inline-flex items-center gap-1 rounded-md border border-blue-400/35 bg-[#0D172E] px-2.5 py-1.5 text-xs font-medium text-blue-300 transition-colors hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                                >
                                  Listen
                                  <ArrowUpRight className="h-3 w-3" />
                                </a>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const rel = RELEASES.find((r) => r.id === track.releaseId);
                                    if (rel) setInspectedRelease(rel);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-md border border-blue-200/15 bg-[#0D172E] px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-white hover:text-white cursor-pointer"
                                >
                                  Stores
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Direct Ditto & Social Links Hub with Interactive Filter */}
                <div className="border-t border-blue-200/12 pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                    <h3 className="text-xs font-semibold tracking-wide text-blue-300">
                      Official Song &amp; Social Links
                    </h3>

                    <div
                      role="group"
                      aria-label="Filter official links"
                      className="inline-flex items-center gap-1 rounded-lg border border-blue-200/15 bg-[#0D172E] p-1"
                    >
                      {(
                        [
                          { id: 'all', label: 'All' },
                          { id: 'song', label: 'Songs' },
                          { id: 'social', label: 'Socials' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setLinkFilter(tab.id)}
                          className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                            linkFilter === tab.id
                              ? 'bg-[#2563EB] text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {filteredLinks.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-xl border border-blue-200/12 bg-[#0D172E] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-xs font-mono text-slate-400 truncate">
                            {item.shortUrl}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopySmartLink(item.id, item.url)}
                            className="inline-flex min-h-[38px] flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg border border-blue-200/15 bg-[#070D1B] px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-white hover:text-white cursor-pointer"
                          >
                            {copiedLinkId === item.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-blue-400" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 text-slate-400" />
                                Copy Link
                              </>
                            )}
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[38px] flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
                          >
                            {item.actionLabel}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. LIVE MINISTRY GALLERY & SCHEDULE (ICE PORCELAIN GALLERY WALL) */}
        <section id="gallery" className="bg-[#F3F6FC] text-[#0A1122] py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1D4ED8]">
                  Ministry Moments &amp; Live Stage
                </p>
                <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0A1122]">
                  Worship &amp; Live Ministration
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                Tap or click any photograph to open full-screen stage view.
              </p>
            </div>

            <div className="mt-8 sm:mt-9 grid gap-4 sm:gap-5 md:grid-cols-12">
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="group relative md:col-span-7 aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-[#070D1B] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                aria-label={`View ${GALLERY_PHOTOS[0].title} full screen`}
              >
                <ResilientImage
                  src={GALLERY_PHOTOS[0].src}
                  alt={GALLERY_PHOTOS[0].title}
                  fallbackTitle={GALLERY_PHOTOS[0].title}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <span className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-[#070D1B]/80 text-white sm:opacity-0 transition-opacity group-hover:opacity-100">
                  <Expand className="h-4 w-4" />
                </span>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs font-semibold text-blue-300">{GALLERY_PHOTOS[0].context}</p>
                  <p className="mt-1 font-display text-xl font-semibold text-white">
                    {GALLERY_PHOTOS[0].title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-200">{GALLERY_PHOTOS[0].caption}</p>
                </div>
              </button>

              <div className="md:col-span-5 grid grid-cols-2 gap-4 sm:gap-5">
                {GALLERY_PHOTOS.slice(1).map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setLightboxIndex(idx + 1)}
                    className="group relative aspect-[4/3] md:aspect-auto overflow-hidden rounded-2xl border border-slate-200 bg-[#070D1B] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                    aria-label={`View ${photo.title} full screen`}
                  >
                    <ResilientImage
                      src={photo.src}
                      alt={photo.title}
                      fallbackTitle={photo.title}
                      className={`h-full w-full object-cover ${photo.objectPosition ?? 'object-center'} transition-transform duration-300 group-hover:scale-[1.03]`}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3.5 right-3.5">
                      <p className="text-[11px] text-blue-300 font-semibold truncate">
                        {photo.context}
                      </p>
                      <p className="text-xs font-semibold text-white truncate">{photo.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div id="tour" className="mt-14 pt-12 border-t border-slate-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#0A1122]">
                    Ministry &amp; Concert Schedule
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Worship nights, fellowships, and concert dates. Open for invitations nationwide
                    and abroad.
                  </p>
                </div>

                <div
                  role="group"
                  aria-label="Filter appearances"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 self-start sm:self-auto shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setTourFilter('upcoming')}
                    className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      tourFilter === 'upcoming'
                        ? 'bg-[#070D1B] text-white'
                        : 'text-slate-600 hover:text-[#0A1122]'
                    }`}
                  >
                    Upcoming Sessions
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourFilter('archive')}
                    className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      tourFilter === 'archive'
                        ? 'bg-[#070D1B] text-white'
                        : 'text-slate-600 hover:text-[#0A1122]'
                    }`}
                  >
                    Release Milestones
                  </button>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:gap-0 sm:divide-y sm:divide-slate-200 sm:border-y sm:border-slate-200">
                {filteredTourDates.map((show) => (
                  <div
                    key={show.id}
                    className="grid items-center gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:rounded-lg sm:border-0 sm:bg-transparent sm:px-2 sm:py-4 sm:grid-cols-12 sm:hover:bg-white transition-colors"
                  >
                    <div className="sm:col-span-2 font-mono text-xs font-semibold text-[#1D4ED8] sm:text-[#0A1122] tabular-nums">
                      {show.dateDisplay}
                    </div>

                    <div className="sm:col-span-3">
                      <p className="text-sm font-semibold text-[#0A1122]">{show.venue}</p>
                      <p className="text-xs text-slate-600">
                        {show.city} · {show.country}
                      </p>
                    </div>

                    <div className="sm:col-span-4 text-xs text-slate-600">
                      <span>{show.format}</span>
                      <span className="mx-2" aria-hidden="true">
                        ·
                      </span>
                      <span>{show.support}</span>
                    </div>

                    <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t border-slate-100 sm:border-0">
                      <span
                        className={`text-xs font-semibold ${
                          show.status === 'Registration Open'
                            ? 'text-[#1D4ED8]'
                            : show.status === 'Archive'
                            ? 'text-slate-500'
                            : 'text-[#0A1122]'
                        }`}
                      >
                        {show.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedTourDate(show)}
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] ${
                          show.status !== 'Archive'
                            ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                            : 'border border-slate-300 bg-white text-[#0A1122] hover:border-[#070D1B] hover:bg-[#070D1B] hover:text-white'
                        }`}
                      >
                        <Ticket className="h-3.5 w-3.5" />
                        {show.status === 'Archive' ? 'Details' : 'RSVP / Info'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. PROFESSIONAL BIOGRAPHY, PERSONAL PROFILE & SONGWRITER NOTES (MIDNIGHT SAPPHIRE & BLUE) */}
        <section
          id="biography"
          className="border-y border-blue-200/12 bg-[#070D1B] text-white py-14 sm:py-16 lg:py-20"
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-10">
            <div className="grid gap-10 lg:gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5 space-y-6">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-blue-200/15 bg-[#0D172E]">
                  <ResilientImage
                    src={ARTIST_ASSETS.studioPortraitSeated}
                    alt="Peter Rock seated studio portrait"
                    fallbackTitle="Peter Rock"
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                <div className="rounded-2xl border border-blue-400/20 bg-[#0D172E] p-6">
                  <p className="text-xs font-semibold text-blue-400">Personal Profile</p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-white">
                    Artist Credentials
                  </h3>

                  <dl className="mt-5 divide-y divide-white/10 text-sm">
                    {PERSONAL_PROFILE.map((row) => (
                      <div
                        key={row.label}
                        className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-4"
                      >
                        <dt className="text-xs font-medium text-slate-400 shrink-0">{row.label}</dt>
                        <dd className="text-xs sm:text-sm font-medium text-white sm:text-right">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between gap-10">
                <div>
                  <p className="text-xs font-semibold text-blue-400">Professional Biography</p>
                  <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                    Calling, Worship &amp; Musical Journey
                  </h2>

                  <div className="mt-6 space-y-4 text-sm sm:text-[15px] leading-relaxed text-slate-300">
                    <p>
                      <strong className="font-semibold text-white">Peter Rock</strong> is a
                      Nigerian gospel musician, songwriter, worshipper, and multi-talented
                      instrumentalist whose passion for music and devotion to God have continued to
                      shape his musical journey. Hailing from{' '}
                      <span className="text-white font-medium">Benue State, Nigeria</span>, and
                      proudly of <span className="text-white font-medium">Idoma origin</span>, Peter
                      Rock is a music minister with a deep passion for expressing the presence,
                      power, and love of God through music.
                    </p>
                    <p>
                      His musical journey began in his teenage years, where he discovered and
                      nurtured his passion for music, developing his gifts as a musician and
                      instrumentalist. Over the years, he has grown into a versatile music minister,
                      combining his songwriting abilities, instrumental skills, and worship
                      ministry to create music that inspires, strengthens faith, and draws hearts
                      closer to God.
                    </p>
                    <p>
                      Peter Rock’s music is more than entertainment; it is an expression of
                      worship, a ministry, and a platform for spiritual encounters. His sound
                      carries a strong emphasis on God’s presence, with a desire to see lives
                      transformed, hearts renewed, and people encounter God through genuine
                      worship.
                    </p>
                    <p>
                      Beyond music, Peter Rock is academically accomplished. He is a graduate of{' '}
                      <span className="text-white font-medium">Bayero University, Kano</span>,
                      where he studied{' '}
                      <span className="text-white font-medium">Computer Science</span>. As a
                      songwriter, worshipper, gospel artist, and multi-talented instrumentalist, he
                      continues to pursue his calling with a commitment to excellence, spiritual
                      depth, and impactful music.
                    </p>
                    <p className="pt-2 font-display text-base sm:text-lg font-medium text-blue-400">
                      His passion is simple: to make music that carries God’s presence and points
                      people back to Him.
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/12 pt-8">
                  <p className="text-xs font-semibold text-blue-400">Behind the Songs</p>
                  <h3 className="mt-1.5 font-display text-xl font-semibold text-white">
                    Songwriter Notes
                  </h3>

                  <div className="mt-5 divide-y divide-white/10 border-t border-white/12">
                    {PRESS_QUOTES.map((item) => (
                      <blockquote key={item.id} className="py-5">
                        <p className="text-sm sm:text-base leading-relaxed text-slate-100">
                          “{item.quote}”
                        </p>
                        <footer className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-blue-400">{item.publication}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {item.critic}, {item.role}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-400">{item.releaseContext}</span>
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. BOOKING & INVITATIONS (ICE PORCELAIN EDITORIAL SHEET) */}
        <section
          id="booking"
          ref={bookingSectionRef}
          className="bg-[#F3F6FC] text-[#0A1122] py-14 sm:py-16 lg:py-20"
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-10">
            <div className="grid gap-10 lg:gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#1D4ED8]">
                    Ministry &amp; Event Invitations
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0A1122]">
                    Bookings &amp; Collaborations
                  </h2>

                  <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-slate-600">
                    Available for church worship nights, gospel concerts, campus fellowships,
                    revival conferences, and collaborative studio recordings. Reach out directly by
                    phone, email, or the booking form.
                  </p>

                  <div className="mt-8 border-t border-slate-200 pt-6 space-y-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">Booking Phone</span>
                      <div className="flex items-center gap-2">
                        <a
                          href="tel:08140775771"
                          className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-[#1D4ED8] hover:text-[#0A1122] transition-colors tabular-nums"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          08140775771
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyPhone}
                          aria-label="Copy booking phone number"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-[#0A1122] cursor-pointer"
                        >
                          {copiedPhone ? (
                            <Check className="h-3.5 w-3.5 text-[#2563EB]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">Booking Email</span>
                      <div className="flex items-center gap-2">
                        <a
                          href="mailto:peterrock.1999@gmail.com"
                          className="font-mono text-xs sm:text-sm font-medium text-[#0A1122] hover:text-[#1D4ED8] transition-colors"
                        >
                          peterrock.1999@gmail.com
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          aria-label="Copy booking email"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-[#0A1122] cursor-pointer"
                        >
                          {copiedEmail ? (
                            <Check className="h-3.5 w-3.5 text-[#2563EB]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">YouTube Channel</span>
                      <a
                        href={YOUTUBE_CHANNEL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#0A1122] hover:text-[#1D4ED8] transition-colors"
                      >
                        <span>youtube.com/@peterrock449</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#1D4ED8]" />
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">Instagram</span>
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#0A1122] hover:text-[#1D4ED8] transition-colors"
                      >
                        <span>@peterrock_official</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#1D4ED8]" />
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">Facebook Page</span>
                      <a
                        href={FACEBOOK_PAGE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#0A1122] hover:text-[#1D4ED8] transition-colors"
                      >
                        <span>facebook.com/share/1BXWEkZA66</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#1D4ED8]" />
                      </a>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">Origin</span>
                      <span className="text-xs font-medium text-[#0A1122]">
                        Benue State (Idoma), Nigeria
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-8 text-xs italic text-slate-500">
                  Peter Rock — Music with a message, worship with a purpose, and a sound that
                  carries His presence.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-xs">
                  {inquirySubmitted ? (
                    <div className="py-8">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]">
                        <Check className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-2xl font-semibold text-[#0A1122]">
                        Booking Inquiry Prepared
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                        Thank you, <span className="font-semibold text-[#0A1122]">{senderName}</span>
                        . Your <span className="font-semibold text-[#0A1122]">{inquiryType}</span>{' '}
                        details have been logged. For immediate confirmation, call or message{' '}
                        <span className="text-[#1D4ED8] font-mono font-semibold">08140775771</span>{' '}
                        or email{' '}
                        <span className="font-medium text-[#0A1122]">
                          peterrock.1999@gmail.com
                        </span>
                        .
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setInquirySubmitted(false);
                          setSenderName('');
                          setSenderEmail('');
                          setProjectWindow('');
                          setInquiryBrief('');
                        }}
                        className="mt-6 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-medium text-[#0A1122] hover:bg-[#070D1B] hover:text-white transition-colors cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-5">
                      <div>
                        <span className="block text-xs font-semibold text-slate-700 mb-2">
                          Invitation / Inquiry Type
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {INQUIRY_TYPES.map((type) => {
                            const selected = inquiryType === type;
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setInquiryType(type)}
                                className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                  selected
                                    ? 'bg-[#070D1B] text-white'
                                    : 'border border-slate-300 bg-white text-slate-700 hover:border-[#070D1B] hover:text-[#0A1122]'
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="booking-name"
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Your Name / Church / Ministry
                          </label>
                          <input
                            id="booking-name"
                            type="text"
                            required
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="Pastor David · Grace Fellowship"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#070B14] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="booking-email"
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Email Address
                          </label>
                          <input
                            id="booking-email"
                            type="email"
                            required
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                            placeholder="events@ministry.org"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#070B14] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="booking-window"
                          className="block text-xs font-semibold text-slate-700 mb-1.5"
                        >
                          Event Date &amp; Location
                        </label>
                        <input
                          id="booking-window"
                          type="text"
                          value={projectWindow}
                          onChange={(e) => setProjectWindow(e.target.value)}
                          placeholder="March 2027 · Abuja / Kano / Benue"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#070B14] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="booking-brief"
                          className="block text-xs font-semibold text-slate-700 mb-1.5"
                        >
                          Event Details &amp; Notes
                        </label>
                        <textarea
                          id="booking-brief"
                          rows={4}
                          required
                          value={inquiryBrief}
                          onChange={(e) => setInquiryBrief(e.target.value)}
                          placeholder="Share church/venue details, service schedule, or collaboration notes..."
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#070B14] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                        <span className="text-xs text-slate-500">
                          All bookings: 08140775771 · peterrock.1999@gmail.com
                        </span>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Disc3 className="h-3.5 w-3.5" />
                          Send Booking Inquiry
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET MIDNIGHT SAPPHIRE FOOTER */}
      <footer className="border-t border-blue-200/12 bg-[#070D1B]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 sm:px-6 py-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© 2026 Peter Rock Official. Bookings: 08140775771 · peterrock.1999@gmail.com</p>
          <div className="flex flex-wrap items-center gap-6 text-slate-300">
            <a href="#discography" className="hover:text-white transition-colors">
              Singles
            </a>
            <a href="#listening" className="hover:text-white transition-colors">
              Listening Room
            </a>
            <a href="#gallery" className="hover:text-white transition-colors">
              Gallery
            </a>
            <a href="#biography" className="hover:text-white transition-colors">
              Biography
            </a>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              YouTube
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              Instagram
            </a>
            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              Facebook
            </a>
            <a href="#booking" className="hover:text-white transition-colors">
              Booking
            </a>
          </div>
        </div>
      </footer>

      {/* MODALS & PERSISTENT COMPACT AUDIO DOCK */}
      <ReleaseModal
        release={inspectedRelease}
        currentTrackId={activeTrack?.id ?? null}
        isPlaying={isPlaying}
        onClose={() => setInspectedRelease(null)}
        onPlayTrack={handlePlayTrack}
      />

      <TicketModal
        tourDate={selectedTourDate}
        onClose={() => setSelectedTourDate(null)}
      />

      <StreamPromptModal
        release={streamPromptRelease}
        track={streamPromptTrack}
        onClose={() => setStreamPromptTrack(null)}
        onReplay={(t) => handlePlayTrack(t, true)}
      />

      <PhotoLightboxModal
        photos={GALLERY_PHOTOS}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />

      <AudioDock
        track={activeTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        volume={volume}
        onTogglePlay={() => (isPlaying ? audioEngine.pause() : audioEngine.resume())}
        onPrev={() => handleStepTrack(-1)}
        onNext={() => handleStepTrack(1)}
        onSeek={(sec) => audioEngine.seek(sec)}
        onVolumeChange={(v) => audioEngine.setVolume(v)}
        onClose={() => audioEngine.stop()}
      />
      </div>
    </MotionConfig>
  );
}
