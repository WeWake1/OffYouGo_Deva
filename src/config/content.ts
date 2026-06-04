/* =============================================================================
 *  ✦  THE ONLY FILE YOU NEED TO EDIT  ✦
 * =============================================================================
 *
 *  Every personal word, name, date, photo, note and link on the site lives in
 *  this one file. Change things here (and drop images into `public/photos/`)
 *  and the whole page updates. You shouldn't have to touch any component.
 *
 *  WHAT TO FILL IN — search this file for `[[` to jump between every blank.
 *  Anything wrapped in [[ double brackets ]] is a placeholder I left for you;
 *  the UI will visibly show these as "to-do" so nothing fake ships by accident.
 *
 *  TEXT TOKENS — inside any string you can write:
 *     {her}  → her name          {you}  → your name
 *     {from} → departure city     {to}   → destination city
 *  e.g. "Off you go, {her}." becomes "Off you go, Maya." once you set the name.
 *
 *  DATES — use full ISO strings WITH the timezone offset (so the countdown is
 *  correct no matter where it's opened). India is +05:30.
 * ========================================================================== */

export interface Place {
  city: string;
  /** Airport / shorthand code shown in the mono labels, e.g. "BLR". */
  code: string;
}

export interface Memory {
  /** Path under /public, e.g. "/photos/nandi-hills.jpg". Empty "" => graceful "drop a photo here" slot. */
  src: string;
  /** Place or title for the moment. */
  title: string;
  /** A date or vague timeframe, e.g. "Aug 2025" or "last monsoon". */
  when: string;
  /** One-line memory or inside joke. */
  caption: string;
  /** Alt text for screen readers — describe the photo. */
  alt: string;
}

export interface OpenWhenNote {
  /** The prompt on the unlit lantern, e.g. "open when you're homesick". */
  label: string;
  /** The message revealed when she taps to light it. */
  message: string;
}

export interface SiteContent {
  /** Used for <title> and social preview. */
  siteTitle: string;
  siteTagline: string;

  // — People —
  herName: string;
  /** Short name / nickname — used only in the hero headline. */
  herShortName: string;
  yourName: string;

  // — The journey —
  from: Place;
  to: Place;
  /** IANA timezones for the dual clock + a correct countdown. */
  timezones: { from: string; to: string };
  /** Great-circle distance, just for the label. Tweak if your cities differ. */
  distanceKm: number;

  // — The two moments that matter —
  /** When she leaves. Tomorrow night, ~22:00 IST from Bengaluru. */
  departureISO: string;
  /** When she's back. THE countdown target — set the real date. */
  returnISO: string;

  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    scrollCue: string;
  };

  countdown: {
    lead: string;
    /** Shown under the digits; {returnDate} is filled in automatically. */
    subline: string;
    /** Tiny label over the departure→return progress bar. */
    progressNote: string;
    doneTitle: string;
    doneMessage: string;
  };

  /**
   * The boarding pass that the countdown is rendered as (see <Countdown/>): a
   * warm paper ticket whose left panel carries the journey and whose perforated
   * stub holds the live days-till-home. These are the playful "flight" fields —
   * tweak them to taste; the route, dates and countdown come from the data above.
   */
  boardingPass: {
    /** Small brand line, top-left of the pass. */
    brand: string;
    /** Tiny airline tag under the brand. */
    airline: string;
    /** Playful flight number. */
    flightCode: string;
    /** Cabin class — keep it sweet, e.g. "FRIENDSHIP". */
    travelClass: string;
    /** Seat assignment. */
    seat: string;
    /** Status on the stub while she's away. */
    status: string;
    /** Status once the countdown hits zero. */
    arrivedStatus: string;
    /** Diagonal rubber-stamp across the pass. Set "" to hide it. */
    stamp: string;
    /** Label above the big live "days" number on the stub. */
    daysLabel: string;
  };

  memories: {
    title: string;
    intro: string;
    items: Memory[];
    /** The "more photos" call-to-action button under the wall. */
    moreLabel: string;
    /** The small asterisked line under the button. */
    moreNote: string;
    /** Where the button leads — the full photo album. Set "" to hide the button. */
    moreHref: string;
  };

  /** The "time apart" tracker: a dot-a-day grid + four live progress rings. */
  timeApart: {
    title: string;
    intro: string;
    /** Small label at the top-left of the dot grid. */
    gridLabel: string;
  };

  openWhen: {
    title: string;
    intro: string;
    notes: OpenWhenNote[];
  };

  music: {
    title: string;
    note: string;
    /** "spotify" | "youtube" | "" — leave provider+url empty to hide the whole section. */
    provider: 'spotify' | 'youtube' | '';
    /** The EMBED url (Spotify: .../embed/playlist/..., YouTube: .../embed/...). */
    embedUrl: string;
  };

  letter: {
    title: string;
    greeting: string;
    paragraphs: string[];
    signoff: string;
    signature: string;
    /** Optional P.S. line. Set to "" to hide. */
    ps: string;
    /**
     * The secret "flip side" of the letter — revealed only when the open letter
     * is in full screen and you swipe it left (a click ‹›/arrow-key fallback is
     * there too, for desktop + screen readers). Set `enabled: false` to hide it
     * entirely. The photo is dropped in the middle, between the two paragraph
     * blocks, so write the lead-up in `paragraphsBefore` and the pay-off in
     * `paragraphsAfter`.
     */
    hidden: {
      /** Master switch — set false to remove the secret letter completely. */
      enabled: boolean;
      /** Everything said before the photo. Each item is its own paragraph. */
      paragraphsBefore: string[];
      /** Photo path under /public, e.g. "/photos/flower.jpg". "" => a "drop a photo here" slot. */
      image: string;
      /** Alt text for the photo (describe it for screen readers). */
      imageAlt: string;
      /** The little caption under the photo. Set "" to hide. */
      imageCaption: string;
      /** Everything said after the photo. The last line gets the big closing flourish. */
      paragraphsAfter: string[];
    };
  };

  /** The closing toy: an interactive pit of marbles to swirl your cursor through. */
  marbles: {
    title: string;
    intro: string;
    /** Small hint shown under the pit. */
    hint: string;
    /** How many marbles fill the pit. */
    count: number;
  };

  footer: {
    sameSkyLine: string;
    madeWith: string;
  };

  /** A little easter egg printed to the browser console for the fellow coder. */
  consoleMessage: string;
}

export const content: SiteContent = {
  siteTitle: 'Under One Sky',
  siteTagline: "A send-off, written in lanterns — counting down until you're home.",

  // ─── People ──────────────────────────────────────────────────────────────
  herName: 'Devanandana',
  herShortName: 'Deva', // shown only in the hero "Off you go, …"
  yourName: 'WeWake', // signs the letter ({you})

  // ─── The journey ─────────────────────────────────────────────────────────
  // Known facts baked in. Confirm the destination city — change to Hsinchu /
  // Tainan if that's where the lab actually is, and the code + distance update
  // the labels automatically (distance is cosmetic, tweak to taste).
  from: { city: 'Bengaluru', code: 'BLR' },
  to: { city: 'Taipei', code: 'TPE' }, // TODO: confirm city (Hsinchu? Tainan?)
  timezones: { from: 'Asia/Kolkata', to: 'Asia/Taipei' },
  distanceKm: 4100,

  // ─── The two moments ─────────────────────────────────────────────────────
  // Departure: tomorrow night ~22:00 IST from BLR. Adjust if the time differs.
  departureISO: '2026-05-30T12:00:00+05:30', // 12:00 PM IST from BLR
  // Return: she's back in Bengaluru on 18 Nov 2026. THIS drives the whole countdown.
  returnISO: '2026-11-18T22:00:00+05:30', // back here on 18 Nov (time-of-day a guess — tweak if you know it)

  // ─── Hero ────────────────────────────────────────────────────────────────
  hero: {
    kicker: 'written in lanterns',
    title: 'Off you go, {her}.',
    subtitle:
      "There is only One sky between us. I made you a lantern for every reason to come back — look up.",
    scrollCue: 'look up',
  },

  // ─── Countdown (the emotional centerpiece) ───────────────────────────────
  countdown: {
    lead: "until you're back under our sky",
    subline: 'You land home on {returnDate}. I’m already counting.',
    progressNote: 'the time apart, lighting up second by second',
    doneTitle: "You're home.",
    doneMessage: 'The sky’s complete again. Welcome back, {her}.',
  },

  // ─── Boarding pass (the countdown, as a paper ticket) ────────────────────
  // Playful, like a real stub. The route + dates are pulled from the journey
  // above; these are just the fun fields. Change any of them — or set stamp to
  // "" to drop the diagonal stamp.
  boardingPass: {
    brand: 'Boarding Pass',
    airline: 'Under One Sky Airways',
    flightCode: 'RSRCH-06', // 6 — for the six months
    travelClass: 'FRIENDSHIP',
    seat: '1A', // window seat, obviously
    status: 'MISSED ALREADY',
    arrivedStatus: 'WELCOME HOME',
    stamp: 'BON VOYAGE',
    daysLabel: 'days till home',
  },

  // ─── Memories ────────────────────────────────────────────────────────────
  // These point at the optimized photos in public/photos/ (photo-01.jpg …),
  // generated from the originals in /Photos by scripts/optimize-photos.ps1.
  // Re-run that script if you add or swap photos, then bump the count below.
  //
  // title/when/caption are OPTIONAL — left as '' the print shows clean, with no
  // label. To caption an individual photo, replace its entry with an object,
  // e.g. { src: '/photos/photo-03.jpg', title: 'Nandi Hills', when: 'Aug 2025',
  //        caption: 'the sunrise we drove all night for', alt: '…' }.
  memories: {
    title: 'everything we already shared',
    intro: 'All the fun times we have had together! Strung up like little lanterns.',
    // 35 photos, spread across the drifting string-lights and wrapping onto rows.
    items: Array.from({ length: 35 }, (_, i) => ({
      src: `/photos/photo-${String(i + 1).padStart(2, '0')}.jpg`,
      title: '',
      when: '',
      caption: '',
      alt: `A memory with Deva (${i + 1} of 35)`,
    })),
    // The call-to-action under the wall → the full Google Photos album.
    moreLabel: 'more Big D!!',
    moreNote: '(d is for deva and deva is big, hence big D!!!)',
    moreHref: 'https://photos.app.goo.gl/aAD8GudokT1vbC186',
  },

  // ─── Time apart tracker ────────────────────────────────────────────────────
  // A dot per day for the whole time apart (departure → return), lighting up as
  // the days pass — today glows. Below it, four live rings: the whole trip, then
  // the current month, week and day. It's all computed from the journey dates +
  // the viewer's clock; only the copy below is editable.
  timeApart: {
    title: 'the days, one by one',
    intro:
      'A dot for every day you’re away — they light up as they pass, and today glows. The rings below fill the whole trip, the month, the week and the day.',
    gridLabel: 'time apart',
  },

  // ─── Open when… ──────────────────────────────────────────────────────────
  // Add or remove notes freely. Keep the messages short — they’re lanterns,
  // not letters (the letter comes later).
  openWhen: {
    title: 'open when…',
    intro: 'Little lanterns for specific nights. Tap one to light it.',
    notes: [
      { label: "open when you're homesick", message: 'I doubt that you will be missing home but if you ever do, you can just scroll up and see how many days are left lol!' },
      { label: 'open when you ace something', message: 'Yayy!!! No Deva doubters ever!! You always ace shi!!' },
      { label: 'open when you miss home food', message: 'Nahhh you wont miss ghar food, youll be too busy enjoying the local cuisine!' },
      { label: "open when you can't sleep", message: '1 sheep... 2 sheep... 3 sheep... lol jk just think of all the fun time you have had but firstly throw that damn phone away' },
      { label: 'open when you doubt yourself', message: 'If you ever doubt yourself, remember all the times priyo doubted you and you proved him wrong!! And if you can prove that dhum dhum wrong then you can prove yourself!!' },
      { label: "open when you're happy", message: 'Just sit down and take in the moment and try to capture it!' },
    ],
  },

  // ─── Music ───────────────────────────────────────────────────────────────
  // Paste a Spotify or YouTube *embed* URL and set the provider. Leave both
  // empty and this section disappears cleanly.
  //   Spotify:  open a playlist → Share → Embed playlist → copy the src URL
  //             (looks like https://open.spotify.com/embed/playlist/XXXX)
  //   YouTube:  https://www.youtube.com/embed/XXXX  (or a playlist embed URL)
  music: {
    title: 'something to play while you pack',
    note: 'For the flight, and the first quiet week over there.',
    provider: '', // 'spotify' | 'youtube' | ''   ← set this
    embedUrl: '', // [[paste embed URL — or leave empty to hide]]
  },

  // ─── The letter ──────────────────────────────────────────────────────────
  // The long, real one. Write it like you'd say it. Each array item is its own
  // paragraph. Take your time here — this is the part she'll reread.
  letter: {
    title: 'one more thing',
    greeting: 'Dear {her},',
    // Written like he'd say it — typos, swears and all. Each array item is its
    // own paragraph (the short one-liners are deliberate beats in the film-take
    // bit). Backtick strings so the straight apostrophes/quotes don't need escaping.
    paragraphs: [
      `We met over 3 flipin years ago and the very first time I met you I saw the sparks spark off`,
      `cheee wtf love story I'm writing!!`,
      `--- CUT --- CUT ---`,
      `TAKE 2!!`,
      `Hiiiii GURLL!!!`,
      `What full freedom and all aaa? lol jk I hope you're having the best time of your life!! crazy that 3 fuckign years of our engineering has passed by!!`,
      `Especially the last year has been fucking crazy!! and I fucking mean it. Honestly the first two years here didn't feel like I was doing engineering at all, I was in god knows which world and was never doing the things I like but this past year has been FUCKING AMAZINGLY CRAZYY!!!`,
      `We started with a simple nexovate wala hackathon and mann has the journey been crazy!! Win after win, just like how they show in movies, where the protagonist is winning fights after fights lol!!`,
      `All the hackathons we did together, all the group outings we went together, they all wouldn't be the same without you!! and I flipin mean it!!! Without you god knows who'd be there to keep me in track as every 2 mins I would go astray, wander off and get lost!`,
      `I've never said this but YOU are the backbone of our friend circle, if it weren't for you I doubt we would have registered for so many hackathongs, if it weren't for you I doubt we would have gone for so many outings, your willingness to always do things no matter what is fucking amazing!! and that's the only part of you of which I'm envious (unlike priyo who is envious of everything, even the fact that you're in Taiwan rn, I bet you he's like "I wish it would have been me lmao) lol cuz sometimes I want to do stuff but I back down looking at the path but instead you just jump right into it and get started and best part you Don't Stop till you Finish it!! And I have huge respect for that!! (cuz remember once I told you that you're a very strong independent girl? yea I really meant that!! honestly at times I look at you and inspire myself)`,
      `And recently the time we spent together is some of the best I've ever spent with a human.`,
      `All the times we went for a quick fun drink and sat up the hill or under that tree lol. They have all been soo fuckin awesome cuz we just sit and chill no judging nothing just chill and I cherish it all and I hope you do too!!`,
      `All I would like to say in the end is, You are an Amazing fukcing human and you deserve all you have right and much more!!`,
      `So... You fucking GOOOOO GUURRRLLLLLLLLLLL!!!!!!!!!!!`,
    ],
    signoff: 'Always,',
    signature: '{you}',
    ps: `(by this time you must know that when ever I use the word "fucking" or "flipin" or something like that it means that it carries weight and whatever I say after that is meant 100% 100% lol).`,

    // ─── The secret flip side ────────────────────────────────────────────────
    // Hidden behind a swipe-left on the full-screen letter. Drop the flower photo
    // into public/photos/ and set `image` to its path (e.g. "/photos/flower.jpg").
    hidden: {
      enabled: true,
      paragraphsBefore: [
        `WOW DEVAA YOU'RE SMART ENOUGH TO FIND THIS lol jk you just had to swipe left to flip it.`,
        `Today is exactly the day (30th of May) last year, when I broke up! I was all done with shit and wanted to START OVER!! You know the whole thing.`,
        `You know the part of the story that it was AIML exam and I went to her and Initiated the break up blah blah blahh....`,
        `Something I've never told you is that, on that day I never ever planned to go and tell ask her to break up. That day when I woke, I woke up to a women crying right opposite of my room's window, I woke up and went to check cuz I had been hearing that women cry and scream for the past 2 hours even in my sleep. When I went to the window thats what I realized that someone had passed away in that house and thats the reason why she had been crying, shouting and screaming. It was very weird, on one hand One person might tell how is this all related, but I think the other wise cuz I think that it was a sign from the universe. Literally waking up while one did not and hearing the screams of their loved ones and all...`,
        `And another crazy thing that happend that same morning was when I woke up and went to the balcony, I saw a flower in a pot. A flower plant which had not bloomed for literally a year!!! I am not joking as June 2024 I got my mom a flower plant on her birthday as a gift, and ever since it had NEVER bloomed but exactly on the day when I broke up, it bloomed with one of the most prettiest flower I had ever seen.`,
        `idk but universe does throw a sign every now and then!!`,
      ],
      image: '/photos/flower.jpg', // the flower that bloomed that morning
      imageAlt: 'The flower that bloomed that morning',
      imageCaption: 'This is that flower!',
      paragraphsAfter: [
        `Basically my point is that this time last year the complete trajectory of my life changed and made me meet all you guys and all!!`,
        `Similarly, On the same exact day this year, You are on the way to change your life forever!!!`,
        `IT'S YOUR TURN NOW!!!`,
      ],
    },
  },

  // ─── Marbles (the closing toy) ─────────────────────────────────────────────
  // A daft little send-off: a pit of marbles you can swirl your cursor through.
  // `count` is how many fill the pit; bump it up or down to taste.
  marbles: {
    title: 'one for the road',
    intro: "Before you go. Here are all your balls, every last one. Run your cursor/finger through them, and let's keep them together.",
    hint: 'drag your cursor/finger through them — give them a swirl',
    count: 150,
  },

  // ─── Footer ──────────────────────────────────────────────────────────────
  footer: {
    sameSkyLine: 'same sky · different timezone · still counting',
    madeWith: 'made with a lot of love and one too many sleepless nights by wewake',
  },

  // ─── Console easter egg (for the fellow dev) ─────────────────────────────
  consoleMessage:
    "Caught you in the console. Some things you have to build yourself. Safe flight, {her}. ✦",
};

export default content;
