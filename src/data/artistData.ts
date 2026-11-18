export type ReleaseCategory = 'Worship Singles' | 'Gospel Ballads' | 'Acoustic Sessions';

export interface StreamingLink {
  platform: string;
  url: string;
}

export interface SynthProfile {
  bpm: number;
  musicalKey: string;
  chords: number[][];
  arpPattern: number[];
  filterCutoff: number;
  timbre: 'warm-analog' | 'felt-chamber' | 'crystalline-fm' | 'sub-cathedral';
  pulseDepth: number;
}

export interface Track {
  id: string;
  releaseId: string;
  releaseTitle: string;
  coverUrl: string;
  previewUrl: string;
  previewDurationSec: number;
  previewDurationLabel: string;
  smartLinkUrl?: string;
  number: string;
  title: string;
  durationSec: number;
  durationLabel: string;
  instrumentation: string;
  synth: SynthProfile;
}

export interface Release {
  id: string;
  catalogNumber: string;
  title: string;
  category: ReleaseCategory;
  format: string;
  year: string;
  label: string;
  runtime: string;
  trackCount: number;
  coverUrl: string;
  smartLinkUrl?: string;
  smartLinkLabel?: string;
  featured?: boolean;
  synopsis: string;
  linerNotes: string;
  credits: string;
  formatsAvailable: string[];
  streamingLinks: StreamingLink[];
  tracks: Track[];
}

export interface TourDate {
  id: string;
  dateISO: string;
  dateDisplay: string;
  city: string;
  country: string;
  venue: string;
  format: string;
  status: 'Open Entry' | 'Registration Open' | 'Confirmed' | 'Archive';
  isUpcoming: boolean;
  doorsTime: string;
  setTime: string;
  support: string;
  venueAddress: string;
}

export interface PressQuote {
  id: string;
  publication: string;
  critic: string;
  role: string;
  date: string;
  releaseContext: string;
  quote: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  context: string;
  caption: string;
  objectPosition?: string;
}

export const ARTIST_ASSETS = {
  // Song artworks
  betterThanWineCover: '/assets/aistudio/better-than-wine-cover.jpeg',
  holdMyHandsCover: '/assets/aistudio/ChatGPT_Image_Aug_5__2026__02_47_12_PM_2_73535f6b.jpeg',
  whereHeLeadsCover: '/assets/aistudio/ChatGPT_Image_Aug_5__2026__03_14_03_PM_1_3e1742a4.jpg',

  // Studio & Live Ministry Photographs
  studioPortraitArmsFolded: '/assets/aistudio/SKY_4886_75ac0c96.jpg',
  studioPortraitSeated: '/assets/aistudio/SKY_4882_078df5bd.jpg',
  divineServiceReflection: '/assets/aistudio/FB_IMG_1785143592552_b5cb310c.jpg',
  liveStageSmile: '/assets/aistudio/FB_IMG_1785455802067_9e26f829.jpg',
  liveStageWorshipping: '/assets/aistudio/FB_IMG_1785455885745_e2640927.jpg',
  liveStageChoirWide: '/assets/aistudio/FB_IMG_1785455889754_af1dca5c.jpg',
  liveStageArmRaised: '/assets/aistudio/FB_IMG_1785481229840_26cd3d0d.jpg',
} as const;

export const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@peterrock449?si=aZz0VcZWOuOSwL4C';
export const FACEBOOK_PAGE_URL = 'https://www.facebook.com/share/1BXWEkZA66';
export const INSTAGRAM_URL = 'https://www.instagram.com/peterrock_official/';

export const OFFICIAL_SMARTLINKS = [
  {
    id: 'link-better-than-wine',
    category: 'song' as const,
    title: 'Better Than Wine',
    subtitle: 'Official Single · All Streaming Platforms',
    url: 'https://ditto.fm/better-than-wine',
    shortUrl: 'ditto.fm/better-than-wine',
    actionLabel: 'Open Song',
  },
  {
    id: 'link-where-he-leads',
    category: 'song' as const,
    title: 'Where He Leads (Acoustic Version)',
    subtitle: 'Acoustic Single · All Streaming Platforms',
    url: 'https://ditto.fm/where-he-leads-acoustic-version',
    shortUrl: 'ditto.fm/where-he-leads-acoustic-version',
    actionLabel: 'Open Song',
  },
  {
    id: 'link-hold-my-hands',
    category: 'song' as const,
    title: 'Hold My Hands',
    subtitle: 'Official Single · All Streaming Platforms',
    url: 'https://ditto.fm/hold-my-hands-peter-rock',
    shortUrl: 'ditto.fm/hold-my-hands-peter-rock',
    actionLabel: 'Open Song',
  },
  {
    id: 'link-youtube-channel',
    category: 'social' as const,
    title: 'Official YouTube Channel (@peterrock449)',
    subtitle: 'Official Videos, Audio & Live Ministrations',
    url: YOUTUBE_CHANNEL_URL,
    shortUrl: 'youtube.com/@peterrock449',
    actionLabel: 'Open Channel',
  },
  {
    id: 'link-instagram',
    category: 'social' as const,
    title: 'Official Instagram (@peterrock_official)',
    subtitle: 'Worship Reels, Studio Clips & Ministry Updates',
    url: INSTAGRAM_URL,
    shortUrl: 'instagram.com/peterrock_official',
    actionLabel: 'Open Profile',
  },
  {
    id: 'link-facebook',
    category: 'social' as const,
    title: 'Official Facebook Page',
    subtitle: 'Community Fellowship, Live Events & Releases',
    url: FACEBOOK_PAGE_URL,
    shortUrl: 'facebook.com/share/1BXWEkZA66',
    actionLabel: 'Open Page',
  },
];

export const PERSONAL_PROFILE = [
  { label: 'Stage Name', value: 'Peter Rock' },
  { label: 'Profession', value: 'Gospel Musician & Music Minister' },
  { label: 'Other Roles', value: 'Songwriter, Worshipper, Multi-talented Instrumentalist' },
  { label: 'Education', value: 'B.Sc. Computer Science, Bayero University, Kano' },
  { label: 'State of Origin', value: 'Benue State, Nigeria' },
  { label: 'Tribe', value: 'Idoma' },
  { label: 'Date of Birth', value: '8th September' },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gallery-arm-raised',
    src: ARTIST_ASSETS.liveStageArmRaised,
    title: 'Leading Corporate Worship',
    context: 'Live Worship Ministration',
    caption: 'Pointing hearts heavenward during a live worship encounter alongside the choir.',
    objectPosition: 'object-top',
  },
  {
    id: 'gallery-worshipping',
    src: ARTIST_ASSETS.liveStageWorshipping,
    title: 'Spirit-Led Ministration',
    context: 'Hard Shift ’26',
    caption: 'Deep devotional moment on stage leading the congregation in worship.',
    objectPosition: 'object-top',
  },
  {
    id: 'gallery-choir-wide',
    src: ARTIST_ASSETS.liveStageChoirWide,
    title: 'Vocal & Choir Ensemble',
    context: 'Live Worship Session',
    caption: 'Ministering alongside backing vocalists in full unity and reverence.',
    objectPosition: 'object-top',
  },
  {
    id: 'gallery-stage-joy',
    src: ARTIST_ASSETS.liveStageSmile,
    title: 'Praise & Fellowship',
    context: 'Hard Shift ’26',
    caption: 'Sharing the joy of gospel music with the congregation on stage.',
    objectPosition: 'object-top',
  },
  {
    id: 'gallery-divine-service',
    src: ARTIST_ASSETS.divineServiceReflection,
    title: 'Quiet Preparation & Study',
    context: 'F.C.S. Divine Service',
    caption: 'Capturing lyrics, scripture notes, and melody ideas during Divine Service.',
    objectPosition: 'object-top',
  },
];

export const PROOF_METRICS = [
  {
    value: '3',
    label: 'Official Releases',
    detail: 'Better Than Wine · Where He Leads · Hold My Hands',
  },
  {
    value: 'B.Sc.',
    label: 'Computer Science',
    detail: 'Bayero University, Kano',
  },
  {
    value: 'Global',
    label: 'Streaming Platforms',
    detail: 'Spotify · Apple Music · YouTube · Ditto',
  },
  {
    value: '12s',
    label: 'Song Highlights',
    detail: 'Preview the main chorus, then stream in full',
  },
];

export const RELEASES: Release[] = [
  {
    id: 'better-than-wine',
    catalogNumber: 'PR-004',
    title: 'Better Than Wine',
    category: 'Worship Singles',
    format: 'Single',
    year: '2026',
    label: 'Peter Rock Official',
    runtime: '05:34',
    trackCount: 1,
    coverUrl: ARTIST_ASSETS.betterThanWineCover,
    smartLinkUrl: 'https://ditto.fm/better-than-wine',
    smartLinkLabel: 'Stream via Ditto',
    featured: true,
    synopsis:
      'A heartfelt worship expression celebrating the unmatched sweetness of God’s presence—crafted with warm keys, steady devotion, and uplifting vocal harmony.',
    linerNotes:
      'Inspired by quiet devotion and scripture meditation, "Better Than Wine" centers on intimacy with God above every earthly measure.',
    credits: 'Written and performed by Peter Rock. Distributed worldwide via Ditto Music.',
    formatsAvailable: ['Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud', 'Deezer', 'TIDAL'],
    streamingLinks: [
      { platform: 'All Platforms (Ditto)', url: 'https://ditto.fm/better-than-wine' },
      { platform: 'Spotify', url: 'https://open.spotify.com/track/0GXfU5S7gPyW15DSvAAjj3' },
      {
        platform: 'Apple Music',
        url: 'https://music.apple.com/album/better-than-wine/6798305101?i=6798305107',
      },
      { platform: 'YouTube', url: 'https://www.youtube.com/watch?v=rIrQI4M50H8' },
      { platform: 'YouTube Music', url: 'https://music.youtube.com/watch?v=rIrQI4M50H8' },
      { platform: 'SoundCloud', url: 'https://soundcloud.com/peterrock84187/better-than-wine' },
      { platform: 'Deezer', url: 'https://www.deezer.com/track/4205321292' },
    ],
    tracks: [
      {
        id: 'pr-004-01',
        releaseId: 'better-than-wine',
        releaseTitle: 'Better Than Wine',
        coverUrl: ARTIST_ASSETS.betterThanWineCover,
        previewUrl: '/assets/audio/better-than-wine-clip.mp3',
        previewDurationSec: 12,
        previewDurationLabel: '00:12',
        smartLinkUrl: 'https://ditto.fm/better-than-wine',
        number: '01',
        title: 'Better Than Wine',
        durationSec: 334,
        durationLabel: '05:34',
        instrumentation: 'Lead Vocal · Grand Piano · Worship Pad · Warm Bass',
        synth: {
          bpm: 70,
          musicalKey: 'F Major',
          chords: [
            [41, 48, 53, 57],
            [45, 52, 57, 60],
            [46, 53, 58, 62],
            [43, 50, 55, 60],
          ],
          arpPattern: [0, 2, 1, 3, 2, 0, 3, 1],
          filterCutoff: 1120,
          timbre: 'warm-analog',
          pulseDepth: 0.38,
        },
      },
    ],
  },
  {
    id: 'where-he-leads',
    catalogNumber: 'PR-003',
    title: 'Where He Leads (Acoustic Version)',
    category: 'Acoustic Sessions',
    format: 'Acoustic Single',
    year: '2026',
    label: 'Peter Rock Official',
    runtime: '02:18',
    trackCount: 1,
    coverUrl: ARTIST_ASSETS.whereHeLeadsCover,
    smartLinkUrl: 'https://ditto.fm/where-he-leads-acoustic-version',
    smartLinkLabel: 'Stream via Ditto',
    featured: true,
    synopsis:
      'An intimate acoustic worship anthem anchored by warm piano voicings, expressive vocal delivery, and steady faith in following God’s direction.',
    linerNotes:
      'Stripped back to highlight lyrical clarity and genuine worship, "Where He Leads (Acoustic Version)" invites listeners into quiet trust and surrender.',
    credits: 'Written and performed by Peter Rock. Released worldwide across all digital streaming platforms.',
    formatsAvailable: ['Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud', 'Deezer', 'TIDAL'],
    streamingLinks: [
      {
        platform: 'All Platforms (Ditto)',
        url: 'https://ditto.fm/where-he-leads-acoustic-version',
      },
      { platform: 'Spotify', url: 'https://open.spotify.com/track/3Vzs5xg8TFUrPKohRIk61I' },
      {
        platform: 'Apple Music',
        url: 'https://music.apple.com/album/where-he-leads-acoustic-version/6798443208?i=6798443572',
      },
      { platform: 'YouTube', url: 'https://www.youtube.com/watch?v=vPWYujt1te4' },
      { platform: 'YouTube Music', url: 'https://music.youtube.com/watch?v=vPWYujt1te4' },
      {
        platform: 'SoundCloud',
        url: 'https://soundcloud.com/peterrock84187/where-he-leads-acoustic',
      },
      { platform: 'Deezer', url: 'https://www.deezer.com/track/4206463492' },
    ],
    tracks: [
      {
        id: 'pr-003-01',
        releaseId: 'where-he-leads',
        releaseTitle: 'Where He Leads (Acoustic Version)',
        coverUrl: ARTIST_ASSETS.whereHeLeadsCover,
        previewUrl: '/assets/audio/where-he-leads-clip.mp3',
        previewDurationSec: 12,
        previewDurationLabel: '00:12',
        smartLinkUrl: 'https://ditto.fm/where-he-leads-acoustic-version',
        number: '02',
        title: 'Where He Leads (Acoustic Version)',
        durationSec: 138,
        durationLabel: '02:18',
        instrumentation: 'Lead Vocal · Acoustic Piano · Gentle Strings',
        synth: {
          bpm: 72,
          musicalKey: 'G Major',
          chords: [
            [43, 50, 55, 59],
            [42, 50, 54, 57],
            [40, 47, 52, 55],
            [48, 55, 60, 64],
          ],
          arpPattern: [0, 1, 2, 3, 2, 1, 3, 2],
          filterCutoff: 1180,
          timbre: 'felt-chamber',
          pulseDepth: 0.42,
        },
      },
    ],
  },
  {
    id: 'hold-my-hands',
    catalogNumber: 'PR-002',
    title: 'Hold My Hands',
    category: 'Gospel Ballads',
    format: 'Single',
    year: '2026',
    label: 'Peter Rock Official',
    runtime: '04:19',
    trackCount: 1,
    coverUrl: ARTIST_ASSETS.holdMyHandsCover,
    smartLinkUrl: 'https://ditto.fm/hold-my-hands-peter-rock',
    smartLinkLabel: 'Stream via Ditto',
    synopsis:
      'An intimate soul-gospel ballad built on heartfelt lyricism, tender keyboard chords, and reassuring melodies about God’s steady grace.',
    linerNotes:
      '"Hold My Hands" speaks directly to moments when strength runs low, reminding listeners of steady companionship, comfort, and peace.',
    credits: 'Written and performed by Peter Rock. Available on all major digital music stores.',
    formatsAvailable: ['Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud', 'Deezer', 'TIDAL'],
    streamingLinks: [
      { platform: 'All Platforms (Ditto)', url: 'https://ditto.fm/hold-my-hands-peter-rock' },
      { platform: 'Spotify', url: 'https://open.spotify.com/track/5BlRtA0NocGNIClBp3noLg' },
      {
        platform: 'Apple Music',
        url: 'https://music.apple.com/album/hold-my-hands/6798436533?i=6798436538',
      },
      { platform: 'YouTube', url: 'https://www.youtube.com/watch?v=tGCW5Rf605Y' },
      { platform: 'YouTube Music', url: 'https://music.youtube.com/watch?v=tGCW5Rf605Y' },
      { platform: 'SoundCloud', url: 'https://soundcloud.com/peterrock84187/hold-my-hands' },
      { platform: 'Deezer', url: 'https://www.deezer.com/track/4206411582' },
    ],
    tracks: [
      {
        id: 'pr-002-01',
        releaseId: 'hold-my-hands',
        releaseTitle: 'Hold My Hands',
        coverUrl: ARTIST_ASSETS.holdMyHandsCover,
        previewUrl: '/assets/audio/hold-my-hands-clip.mp3',
        previewDurationSec: 12,
        previewDurationLabel: '00:12',
        smartLinkUrl: 'https://ditto.fm/hold-my-hands-peter-rock',
        number: '03',
        title: 'Hold My Hands',
        durationSec: 259,
        durationLabel: '04:19',
        instrumentation: 'Lead Vocal · Electric Rhodes · Acoustic Strings',
        synth: {
          bpm: 68,
          musicalKey: 'C Major',
          chords: [
            [48, 55, 59, 64],
            [45, 52, 55, 60],
            [41, 48, 52, 57],
            [43, 50, 55, 59],
          ],
          arpPattern: [0, 2, 1, 3, 0, 3, 2, 1],
          filterCutoff: 960,
          timbre: 'warm-analog',
          pulseDepth: 0.35,
        },
      },
    ],
  },
];

export const ALL_TRACKS: Track[] = RELEASES.flatMap((r) => r.tracks);

export const TOUR_DATES: TourDate[] = [
  {
    id: 'ministry-worship-night',
    dateISO: '2026-12-06',
    dateDisplay: '06 DEC 2026',
    city: 'Worship & Encounter Night',
    country: 'Nigeria',
    venue: 'Better Than Wine Live Ministration',
    format: 'Full Band & Worship Choir',
    status: 'Registration Open',
    isUpcoming: true,
    doorsTime: '17:30',
    setTime: '18:30',
    support: 'Acoustic Devotional Opening',
    venueAddress: 'Call 08140775771 or email peterrock.1999@gmail.com to invite Peter Rock',
  },
  {
    id: 'ministry-gospel-concert',
    dateISO: '2027-01-17',
    dateDisplay: '17 JAN 2027',
    city: 'Campus & Youth Revival',
    country: 'Nigeria',
    venue: 'Where He Leads Acoustic Showcase',
    format: 'Piano, Vocals & Live Ensemble',
    status: 'Open Entry',
    isUpcoming: true,
    doorsTime: '18:00',
    setTime: '19:00',
    support: 'Fellowship Worship Collective',
    venueAddress: 'Available for church services, campus fellowships & gospel concerts',
  },
  {
    id: 'ministry-acoustic-night',
    dateISO: '2027-02-14',
    dateDisplay: '14 FEB 2027',
    city: 'Acoustic Worship Session',
    country: 'Nigeria',
    venue: 'Hold My Hands Unplugged',
    format: 'Intimate Keys & Vocal Set',
    status: 'Confirmed',
    isUpcoming: true,
    doorsTime: '18:30',
    setTime: '19:30',
    support: 'Testimony & Song Stories',
    venueAddress: 'Bookings open across Benue, Kano, Abuja & nationwide',
  },
  {
    id: 'ministry-release-night',
    dateISO: '2026-08-16',
    dateDisplay: '16 AUG 2026',
    city: 'Global Digital Release',
    country: 'All Platforms',
    venue: 'Ditto Music Worldwide Distribution',
    format: 'Streaming Premiere',
    status: 'Archive',
    isUpcoming: false,
    doorsTime: '00:00',
    setTime: 'Global',
    support: 'Better Than Wine · Where He Leads · Hold My Hands',
    venueAddress: 'Streaming across Spotify, Apple Music, Boomplay, YouTube Music & SoundCloud',
  },
];

export const PRESS_QUOTES: PressQuote[] = [
  {
    id: 'note-better-than-wine',
    publication: 'Better Than Wine',
    critic: 'Peter Rock',
    role: 'Music Minister',
    date: '2026',
    releaseContext: 'Single PR-004',
    quote:
      'Better Than Wine was born out of deep gratitude for God’s love—a reminder that nothing compares to His presence.',
  },
  {
    id: 'note-where-he-leads',
    publication: 'Where He Leads (Acoustic Version)',
    critic: 'Peter Rock',
    role: 'Songwriter',
    date: '2026',
    releaseContext: 'Single PR-003',
    quote:
      'Where He Leads is about surrendering fear and trusting God’s direction step by step—carrying His presence into every season of life.',
  },
  {
    id: 'note-hold-my-hands',
    publication: 'Hold My Hands',
    critic: 'Peter Rock',
    role: 'Worshipper',
    date: '2026',
    releaseContext: 'Single PR-002',
    quote:
      'I wrote Hold My Hands as a reminder that even when the road feels uncertain, we are never walking alone. Every chord was built to strengthen faith and draw hearts closer to God.',
  },
];
