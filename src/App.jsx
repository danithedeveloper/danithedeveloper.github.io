/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  src/App.jsx  —  Your Entire Portfolio                          ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                  ║
 * ║  CONTENTS (top to bottom):                                       ║
 * ║   §1  Imports                                                    ║
 * ║   §2  Design Tokens (C)        — colour palette / theme         ║
 * ║   §3  GlobalStyle              — CSS reset + animations         ║
 * ║   §4  DATA constants           — ALL your content               ║
 * ║   §5  useScrollReveal hook     — scroll-triggered animations    ║
 * ║   §6  Navbar                   — fixed top navigation bar       ║
 * ║   §7  Hero                     — first screen with photo        ║
 * ║   §8  Ticker                   — scrolling skills marquee       ║
 * ║   §9  About                    — two-column about section       ║
 * ║  §10  Skills                   — 6-card tech stack grid         ║
 * ║  §11  Experience               — accordion job history          ║
 * ║  §12  Projects                 — filterable project cards       ║
 * ║  §13  AwardsBar                — dark awards strip              ║
 * ║  §14  Contact                  — contact + social links         ║
 * ║  §15  Footer                   — bottom strip                   ║
 * ║  §16  App (root)               — assembles everything           ║
 * ║                                                                  ║
 * ║  REACT NATIVE → REACT WEB CHEAT SHEET:                          ║
 * ║  ─────────────────────────────────────────────────────────────  ║
 * ║  <View>                →  <div>                                  ║
 * ║  <Text>                →  <p> <h1> <span>                       ║
 * ║  <Image source={}>     →  <img src="" />                        ║
 * ║  <TouchableOpacity>    →  <button> or <a>                       ║
 * ║  StyleSheet.create({}) →  style={{ }} inline OR CSS string      ║
 * ║  flex: 1               →  flex: 1  (IDENTICAL!)                 ║
 * ║  marginTop: 10         →  marginTop: 10  (same, px assumed)     ║
 * ║  useState / useEffect  →  IDENTICAL — same React hooks          ║
 * ║  FlatList data={arr}   →  arr.map(item => <Card item={item} />) ║
 * ║  Dimensions.get(win)   →  @media (max-width: 768px) in CSS      ║
 * ║  Animated.timing()     →  CSS transition / @keyframes           ║
 * ║  onPressIn/Out         →  onMouseEnter / onMouseLeave           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ══════════════════════════════════════════════════════════════════
// §1  IMPORTS
// ══════════════════════════════════════════════════════════════════
/**
 * Named imports from 'react' — same hooks you use in React Native.
 *
 * useState    — local component state (identical to RN)
 * useEffect   — side effects: scroll listeners, observers (identical)
 * useCallback — memoises a function so it's not recreated each render
 * memo        — wraps a component to skip re-renders if props unchanged
 *
 * The ONLY difference from React Native:
 *   RN: import { useState } from 'react';  → same
 *   Web: import { useState } from 'react'; → identical
 * These hooks are 100% shared between RN and React Web.
 */
import { useState, useEffect, useCallback, memo } from 'react';


// ══════════════════════════════════════════════════════════════════
// §2  DESIGN TOKENS  (the "C" object)
// ══════════════════════════════════════════════════════════════════
/**
 * A design token is a named value for a design decision.
 * Instead of writing '#E05C2A' everywhere, we write C.accent.
 *
 * BENEFIT: Change ONE value here → entire site rebrands instantly.
 *
 * React Native analogy:
 *   const theme = { primary: '#E05C2A', background: '#FAFAF7' }
 *   This is the exact same pattern, used the same way.
 *
 * HOW TO USE IN JSX:
 *   style={{ color: C.accent }}       ← text colour
 *   style={{ background: C.cream }}   ← background colour
 *   style={{ border: `1px solid ${C.border}` }} ← template literal
 *
 * ╔══════════════════════════════════╗
 * ║  TO REBRAND THE WHOLE SITE:      ║
 * ║  Change accent: '#E05C2A'        ║
 * ║  to any hex colour you want.     ║
 * ║  Everything updates.             ║
 * ╚══════════════════════════════════╝
 */
const C = {
  cream:      '#FAFAF7', // page background — warm off-white (not pure white, easier on eyes)
  white:      '#FFFFFF', // card surfaces, navbar background
  ink:        '#111110', // primary text — near-black (softer than pure #000)
  inkLight:   '#2C2C2A', // secondary text — nav links, labels
  muted:      '#888885', // placeholder text, captions, subtle labels
  border:     '#E8E8E4', // card borders, section dividers
  tag:        '#F0F0EB', // skill tag background chips
  accent:     '#E05C2A', // ← YOUR BRAND COLOUR. Change this to rebrand.
  accentSoft: '#F2A07A', // lighter accent — used in gradients, hover states
  accentBg:   '#FDF1EB', // very light accent tint — pill backgrounds, card fills
  green:      '#2D7A4F', // "available" status dot (not the brand green, a natural green)
};


// ══════════════════════════════════════════════════════════════════
// §3  GLOBAL STYLE COMPONENT
// ══════════════════════════════════════════════════════════════════
/**
 * WHAT IS THIS?
 *   A React component that renders a <style> HTML tag.
 *   The CSS inside applies to the ENTIRE page globally.
 *
 * WHY A COMPONENT instead of a .css file?
 *   Using a component keeps ALL code in ONE file (App.jsx).
 *   For a single-developer portfolio, this is cleaner than
 *   managing a separate App.css alongside App.jsx.
 *   You can also use C.accent inside the CSS via template literals.
 *
 * React Native analogy:
 *   There is NO equivalent in React Native.
 *   RN uses StyleSheet (scoped to components, no global CSS).
 *   Global CSS is a web-only concept.
 *
 * memo():
 *   Wraps the component so React SKIPS re-rendering it if
 *   its props haven't changed. GlobalStyle has NO props and
 *   never needs to re-render after first mount — so memo()
 *   ensures the <style> tag is injected exactly once.
 *   React Native analogy: PureComponent or React.memo in RN.
 */
const GlobalStyle = memo(() => (
  <style>{`

    /*
     * Google Fonts import — MUST be at the top of the CSS string.
     * Loads two fonts:
     *   Playfair Display → elegant serif for headings (your name, section titles)
     *   DM Sans          → clean sans-serif for body text (paragraphs, labels)
     *
     * React Native analogy:
     *   expo-font: useFonts({ 'Playfair-Display': require('./assets/...') })
     *   Here we just import via URL — the browser downloads them automatically.
     */
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');


    /* ── CSS RESET ─────────────────────────────────────────────
     * Browsers apply their own default styles (margins, padding).
     * This resets everything to zero so we start from a clean slate.
     *
     * box-sizing: border-box:
     *   width = content + padding (padding does NOT add to width).
     *   React Native uses border-box by default. Browsers don't,
     *   so we set it manually here for consistent behaviour.
     *
     * *::before, *::after:
     *   Applies to pseudo-elements (CSS-generated content).
     */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /*
     * scroll-behavior: smooth
     *   When user clicks a nav link (e.g. href="#about"),
     *   the page scrolls smoothly instead of jumping instantly.
     *   React Native analogy: scrollView.scrollTo({ animated: true })
     *
     * font-size: 16px
     *   Sets the base font size. rem units (like 1.5rem) are
     *   relative to this. 1rem = 16px, 2rem = 32px, etc.
     */
    html { scroll-behavior: smooth; font-size: 16px; }

    body {
      background: ${C.cream};             /* page background colour */
      color: ${C.ink};                     /* default text colour */
      font-family: 'DM Sans', sans-serif;  /* default font for everything */
      overflow-x: hidden;                  /* prevent horizontal scrollbar from animations */

      /*
       * Font smoothing — improves how text looks on Mac/retina screens.
       * Makes fonts appear thinner and crisper (similar to iOS font rendering).
       * Has no effect on Windows.
       */
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* ── Custom scrollbar (only visible in Chrome/Safari) ─── */
    ::-webkit-scrollbar       { width: 3px; }  /* thin scrollbar */
    ::-webkit-scrollbar-thumb { background: ${C.accent}; border-radius: 2px; }

    /* Text highlight colour when user selects text with mouse */
    ::selection { background: ${C.accent}; color: #fff; }

    /* Remove default underline and blue colour from ALL links */
    a { color: inherit; text-decoration: none; }

    /*
     * Remove default browser button styles.
     * font: inherit → button uses the same font as its parent
     *   (browsers apply a different font to buttons by default).
     */
    button { border: none; background: none; cursor: pointer; font: inherit; color: inherit; }

    /* Prevent images from ever overflowing their container */
    img { max-width: 100%; display: block; }


    /* ── @KEYFRAMES — Animation Definitions ────────────────────
     *
     * Keyframes define HOW an animation runs from start to finish.
     * You then APPLY them to elements via the "animation" property.
     *
     * React Native analogy:
     *   const anim = useRef(new Animated.Value(0)).current;
     *   Animated.timing(anim, { toValue: 1, duration: 700 }).start();
     *
     * In CSS, we just define the keyframes once and reference by name.
     * Much less code than Animated API in React Native.
     */

    /*
     * fadeUp: element slides upward while fading in.
     * Used for hero text, section headings, card reveals.
     *   "from" = start state (invisible, 28px below)
     *   "to"   = end state (visible, natural position)
     */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0);    }
    }

    /*
     * fadeIn: simple opacity fade from 0 → 1.
     * Used for the hero status badge.
     */
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /*
     * floatY: gentle continuous up-down floating.
     * Used on decorative circles and tech tags in the hero.
     * "infinite" makes it loop forever.
     * "ease-in-out" = starts slow, speeds up, slows down (natural feel).
     */
    @keyframes floatY {
      0%, 100% { transform: translateY(0);    }  /* top and bottom = same position */
      50%       { transform: translateY(-14px); } /* midpoint = 14px higher */
    }

    /*
     * floatPhoto: same up-down float as floatY, BUT also keeps the
     * photo vertically centred (translateY -50%).
     *
     * WHY NOT just use floatY on the photo?
     *   The photo uses position:absolute + top:50% to centre itself.
     *   To actually centre it, we need: transform: translateY(-50%).
     *   Problem: if we apply floatY animation, it REPLACES the -50%
     *   transform and the photo snaps to the wrong position.
     *
     * Solution: bake -50% INTO the keyframe using calc().
     *   calc(-50% + 0px) = -50% (centred, at rest)
     *   calc(-50% - 14px) = -50% minus 14px (centred, at top of float)
     */
    @keyframes floatPhoto {
      0%, 100% { transform: translateY(calc(-50% + 0px));  }
      50%       { transform: translateY(calc(-50% - 14px)); }
    }

    /*
     * ticker: continuously scrolls content from right to left.
     * Used in the orange skills marquee bar.
     *
     * HOW THE SEAMLESS LOOP WORKS:
     *   We duplicate the content array (text, text again).
     *   translateX(-50%) moves it exactly one copy's width.
     *   When animation resets to 0, it looks identical to -50%
     *   because the second copy matches the first → seamless loop.
     */
    @keyframes ticker {
      from { transform: translateX(0);    }
      to   { transform: translateX(-50%); }
    }


    /* ── SCROLL REVEAL CLASSES ──────────────────────────────────
     *
     * HOW SCROLL REVEAL WORKS (step by step):
     *
     *   Step 1: You add className="reveal" to an element in JSX.
     *   Step 2: Element starts invisible (opacity: 0) and shifted down.
     *   Step 3: useScrollReveal hook (§5) creates an IntersectionObserver.
     *   Step 4: Observer watches the element. When it enters the viewport,
     *           the observer adds class "visible" to the element.
     *   Step 5: CSS "transition" smoothly animates from "reveal" → "visible".
     *
     * React Native analogy:
     *   onViewableItemsChanged in FlatList, or
     *   Reanimated's useAnimatedScrollHandler — both detect visibility.
     *   Here we do it with CSS + one JavaScript observer, no library needed.
     */

    /* Start state: invisible + shifted 28px down */
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      /* transition: animate THESE properties over 0.65s with ease timing */
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    /* End state: fully visible at natural position */
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* Same but slides in from the LEFT (used for About section visual) */
    .reveal-left {
      opacity: 0;
      transform: translateX(-28px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }


    /* ── REUSABLE CSS CLASSES ───────────────────────────────────
     *
     * Applied via className="" on JSX elements.
     * React Native analogy: shared StyleSheet objects used across
     * multiple components. Same concept, different syntax.
     *
     * WHY classes instead of inline style={{ }}?
     *   CSS :hover pseudo-state CANNOT be done with inline styles.
     *   For hover effects you MUST use a CSS class.
     *   For everything else, inline styles are fine.
     */

    /*
     * .pill: small rounded label/badge
     * Used above every section heading ("About Me", "Skills", etc.)
     */
    .pill {
      display: inline-block;           /* shrink-wraps to text width */
      background: ${C.accentBg};       /* very light orange tint */
      color: ${C.accent};              /* orange text */
      padding: 5px 16px;
      border-radius: 100px;            /* fully rounded (pill shape) */
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.07em;          /* slight character spacing */
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    /*
     * .section-h: large serif section headings
     * Uses clamp() for fluid responsive font size:
     *   clamp(MIN, PREFERRED, MAX)
     *   32px = minimum (small phones)
     *   4.5vw = preferred (scales with viewport width)
     *   54px = maximum (large screens)
     *
     * React Native analogy:
     *   const { width } = Dimensions.get('window');
     *   fontSize: width < 400 ? 32 : width < 768 ? width * 0.045 : 54
     *   CSS clamp() does all this in one value.
     */
    .section-h {
      font-family: 'Playfair Display', serif;
      font-size: clamp(32px, 4.5vw, 54px);
      font-weight: 700;
      letter-spacing: -1px;
      color: ${C.ink};
      line-height: 1.1;
    }

    /*
     * .btn-primary: solid orange CTA button
     * box-shadow creates the orange glow effect beneath the button.
     * transition animates the shadow + position on hover.
     */
    .btn-primary {
      display: inline-flex;           /* aligns icon and text on same line */
      align-items: center;            /* vertically centres icon and text */
      gap: 8px;                       /* space between icon and text */
      background: ${C.accent};
      color: #fff;
      padding: 14px 34px;
      border-radius: 100px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.02em;
      box-shadow: 0 8px 28px rgba(224,92,42,0.32);  /* orange glow */
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .btn-primary:hover {
      transform: translateY(-2px);                    /* lifts up 2px */
      box-shadow: 0 12px 36px rgba(224,92,42,0.42); /* bigger shadow = looks higher */
    }

    /*
     * .btn-outline: transparent button with a border
     * Shows accent colour on hover.
     */
    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      color: ${C.ink};
      padding: 14px 34px;
      border-radius: 100px;
      font-size: 15px;
      font-weight: 500;
      border: 2px solid ${C.border};
      transition: border-color 0.2s ease, color 0.2s ease;
    }
    .btn-outline:hover { border-color: ${C.accent}; color: ${C.accent}; }


    /* ── SKILL CARD HOVER ───────────────────────────────────────
     *
     * When the mouse enters a skill card:
     *   - Card background flips from white to near-black
     *   - Title text turns white
     *   - Icon turns white
     *   - All skill tags get semi-transparent white style
     *
     * HOW IT WORKS:
     *   The hover colour changes are defined HERE in CSS using
     *   class-based selectors (.skill-card:hover .sk-title).
     *   We cannot do this with inline style={{}} because React
     *   inline styles don't support :hover pseudo-states.
     *
     *   The icon's non-hover colour is still set via inline style
     *   (using the iconColor from the SKILLS data array) because
     *   each icon has a DIFFERENT brand colour — you can't put
     *   dynamic values in a static CSS string.
     *
     * !important: overrides inline styles when :hover is active.
     *   This is one of the few valid uses of !important.
     */
    .skill-card { transition: background 0.3s ease; cursor: default; }
    .skill-card:hover { background: ${C.ink} !important; }
    .skill-card:hover .sk-title { color: #fff !important; }
    .skill-card:hover .sk-icon  { color: #fff !important; }
    .skill-card:hover .sk-tag {
      background:   rgba(255,255,255,0.10) !important;
      border-color: rgba(255,255,255,0.15) !important;
      color:        rgba(255,255,255,0.78) !important;
    }

    /*
     * .proj-card: project card hover lift effect.
     * transition lists the properties to animate.
     * The actual background/border colour changes are handled
     * inline in the component via JS state (hovered === i).
     * Only the "lift" (translateY) is done here via CSS
     * because the colour changes need to be dynamic.
     */
    .proj-card {
      transition: transform 0.32s ease, box-shadow 0.32s ease,
                  background 0.32s ease, border-color 0.32s ease;
    }
    .proj-card:hover { transform: translateY(-7px) !important; }

    /* .contact-link: border and text colour change on hover */
    .contact-link { transition: border-color 0.2s ease, color 0.2s ease; }
    .contact-link:hover { border-color: ${C.accent} !important; color: ${C.accent} !important; }

    /*
     * .filter-btn: category filter buttons in the Projects section.
     * .active class is added by React state when a filter is selected.
     * When active, background becomes orange and text becomes white.
     */
    .filter-btn { transition: all 0.2s ease; }
    .filter-btn.active {
      background: ${C.accent} !important;
      color: #fff !important;
      border-color: ${C.accent} !important;
    }


    /* ── RESPONSIVE BREAKPOINTS ─────────────────────────────────
     *
     * @media queries: change layout/visibility at different screen widths.
     *
     * React Native analogy:
     *   const { width } = Dimensions.get('window');
     *   const isMobile = width < 768;
     *   <View style={isMobile ? styles.mobile : styles.desktop} />
     *
     * In CSS, we write the conditional rules directly — no JS needed.
     * The browser applies them automatically based on screen width.
     *
     * Our breakpoints:
     *   1024px → hide floating photo/tags (not enough space)
     *    900px → About grid goes single column
     *    768px → hide desktop nav, show hamburger, 2-col awards
     *    480px → awards go single column
     */
    @media (max-width: 1024px) { .hero-floats { display: none !important; } }
    @media (max-width: 900px)  { .about-grid  { grid-template-columns: 1fr !important; } }
    @media (max-width: 768px)  {
      .desktop-nav { display: none !important; }
      .hamburger   { display: flex !important; }
      .awards-grid { grid-template-columns: 1fr 1fr !important; }
    }
    @media (max-width: 480px)  { .awards-grid { grid-template-columns: 1fr !important; } }

  `}</style>
));
GlobalStyle.displayName = 'GlobalStyle';

// ══════════════════════════════════════════════════════════════════
// §4  DATA — All content lives here. Edit these to update the site.
// ══════════════════════════════════════════════════════════════════
/**
 * WHY keep data separate from components?
 *
 * Separation of concerns — a core principle in software engineering.
 * Components are TEMPLATES. Data is CONTENT. Mixing them makes both
 * harder to maintain.
 *
 * With this structure:
 *   - To add a new project → add one object to ALL_PROJECTS
 *   - To update a job bullet → find it in EXPERIENCE and edit the string
 *   - The rendering components NEVER need to change
 *
 * React Native analogy:
 *   const jobData = [{ id: '1', title: 'Lead Dev', company: '...' }];
 *   <FlatList data={jobData} renderItem={({ item }) => <JobCard {...item} />} />
 *   We use the same pattern — data arrays → .map() → components.
 */

/**
 * SKILLS array — one object per skill card.
 *
 * fa:         Font Awesome icon class (from fontawesome.com/icons)
 *             Format: 'fa-brands fa-react' or 'fa-solid fa-server'
 *             fa-brands = company/technology logos
 *             fa-solid  = filled icons (generic shapes)
 * iconColor:  Icon colour in its resting state (brand colour)
 * title:      Card heading (shown in Playfair Display font)
 * tags:       Array of strings shown as pill-shaped chips
 *
 * TO CHANGE AN ICON:
 *   1. Go to fontawesome.com/icons → filter: Free
 *   2. Find icon → copy class name (e.g. "fa-solid fa-mobile-screen")
 *   3. Replace the fa: value in the object below
 */
const SKILLS = [
  {
    fa: 'fa-brands fa-react',    // React logo: three orbiting ellipses + dot
    iconColor: '#61DAFB',        // React's official brand colour
    title: 'React Native',
    tags: ['Redux', 'Redux-Saga', 'Redux-Thunk', 'MobX', 'Context API',
           'TypeScript', 'Native Bridge', 'Reanimated', 'Axios',
           'Flipper', 'Localization', 'RTL / LTR'],
  },
  {
    fa: 'fa-brands fa-android',  // Android robot logo
    iconColor: '#3DDC84',        // Android's official green
    title: 'Android',
    tags: ['Java', 'Kotlin', 'MVVM / MVC / MVI', 'Jetpack Compose',
           'Room', 'LiveData', 'Dagger Hilt / Koin', 'Retrofit',
           'Esri / GIS Maps', 'Biometrics', 'SignalR', 'RabbitMQ', 'Multi-Module'],
  },
  {
    fa: 'fa-brands fa-apple',    // Apple logo — the REAL Apple icon ✓
    iconColor: '#555555',        // Apple uses charcoal grey for their logo
    title: 'iOS',
    tags: ['Swift', 'Objective-C', 'Auto Layout', 'CocoaPods', 'XCode', 'React Native Config'],
  },
  {
    fa: 'fa-solid fa-server',    // Server rack icon
    iconColor: C.accent,         // Using our brand orange
    title: 'Backend & APIs',
    tags: ['ASP .NET Core', 'Entity Framework', 'Dependency Injection',
           'Auth & Authorization', 'PHP', 'WordPress', 'SQL / MySQL', 'Docker', 'Swagger'],
  },
  {
    fa: 'fa-solid fa-cloud',     // Cloud shape icon
    iconColor: '#0078D4',        // Microsoft Azure's official blue
    title: 'Cloud & DevOps',
    tags: ['Azure DevOps', 'CI / CD Pipelines', 'Firebase', 'AWS',
           'App Center', 'Azure Data Studio', 'Git / SVN', 'JIRA', 'Asana', 'Figma'],
  },
  {
    fa: 'fa-solid fa-plug',      // Electrical plug = integrations/connections
    iconColor: C.accent,
    title: 'Integrations & IoT',
    tags: ['Biometric SDKs (IDEMIA, ICA)', 'NADRA API', 'Google Maps / Esri GIS',
           'Apple Pay', 'HyperTrack', 'Infobip', 'Baidu Maps',
           'In-App Purchases', 'AdMob', 'Social SDKs'],
  },
];

/**
 * EXPERIENCE array — one object per job.
 *
 * role:     Your job title
 * company:  Company name (shown as a clickable link)
 * url:      Company website (opens in a new browser tab)
 * location: City, Country
 * period:   Date range displayed on the right of the accordion row
 * current:  true = shows green "Current" badge (only for your active job)
 * points:   Array of bullet point strings
 *
 * TO ADD A NEW JOB: copy an existing object, paste it at the
 * START of the array (most recent first), and edit the values.
 *
 * TO EDIT A BULLET: find the job object, find the string in
 * points[], and edit the text directly.
 */
const EXPERIENCE = [
  {
    role: 'Lead Software Developer',
    company: 'Ministry of Interior, UAE – Tatweer',
    url: 'https://tatweer-co.ae/',
    location: 'Abu Dhabi, UAE',
    period: 'Nov 2021 — Present',
    current: true,
    points: [
      'Architect and lead React Native & Android applications for Abu Dhabi Police and Abu Dhabi Municipality — mission-critical government platforms with enterprise-grade security serving hundreds of thousands of daily users.',
      'Key deliveries: Radar Assets Management System (Esri GIS, Kotlin, MVVM, Koin), Distortion Management System (road/park inspection), Lead DNA (IDEMIA/ICA biometric — fingerprint, retinal & barcode), Noor Abu Dhabi (street lighting asset management, RTL/LTR), Smart Officer for Rwanda National Police (offline field operations), plus Emirates Face Recognition API, Lead DNA API, and MOI Wellness API in .NET.',
      'Oversee full SDLC: solution architecture, sprint planning, code review, CI/CD via Azure DevOps, stakeholder communication, and production deployments.',
      'Mentored cross-functional team; introduced code-quality standards that reduced the bug escape rate by approximately 45%.',
      'Awarded Ministry of Interior, UAE — Appreciation Certificate for Excellence in Work.',
    ],
  },
  {
    role: 'Mobile Team Lead & React Native Developer',
    company: 'Valtrans – Parkonic',
    url: 'https://www.valtrans.com/',
    location: 'Dubai, UAE',
    period: 'Mar 2021 — Nov 2021',
    points: [
      'Led a mobile development team delivering smart parking solutions across the UAE; managed full product lifecycle from requirements to App Store / Play Store deployment.',
      'Improved user retention 30% through targeted UX enhancements and reliable push-notification infrastructure.',
    ],
  },
  {
    role: 'React Native Consultant',
    company: 'Emaar UAE – Cantaloupe Consulting',
    url: 'https://www.emaar.com/',
    location: 'Dubai, UAE',
    period: 'Jun 2020 — Feb 2021',
    points: [
      'Led full React Native development of the Reel Cinemas App — seat selection, F&B ordering, Apple Pay, loyalty rewards, Infobip push, Firebase analytics, and Qualtrics surveys. Managed the project end-to-end from analysis through production release on iOS and Android.',
      'Achieved a 35% reduction in app load time through performance profiling and architecture refactoring; coached team on Redux-Saga, Native Bridge, and CI/CD best practices.',
    ],
  },
  {
    role: 'Software Developer',
    company: 'Allsopp & Allsopp',
    url: 'https://www.allsoppandallsopp.com/',
    location: 'Dubai, UAE',
    period: 'Sep 2019 — May 2020',
    points: [
      "Developed the Agent Companion App (React Native) — live GPS agent tracking via HyperTrack API, Reapit CRM integration for property viewings, client feedback, and offers management for Dubai's top real estate agency.",
    ],
  },
  {
    role: 'Senior Software Engineer',
    company: 'i2c Inc.',
    url: 'https://www.i2cinc.com/',
    location: 'Lahore, Pakistan',
    period: 'Feb 2017 — Sep 2019',
    points: [
      'Engineered My Card Place (MCP 2.0 & 3.0) — multi-flavour mobile banking platform deployed globally as Comerica Direct Express (US), Australia Post Conext, AC Conversion, AchieveCard, and Golden Nugget, serving millions of users across 10+ markets.',
      'Integrated NADRA biometric fingerprint verification using dedicated hardware (FP05 & FP06) + national identity API for high-security financial authentication.',
      'Built Finger Map (BAS) — biometric attendance system with fingerprint enrolment, Baidu Maps geolocation, and server sync.',
      'Modernised legacy codebase with MVVM architecture, updated libraries, and tablet support — significantly reducing crash rates.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Tracking World (Pvt.) Ltd. – Data Solutions',
    url: 'http://www.trackingworld.com.pk/',
    location: 'Lahore, Pakistan',
    period: 'Jan 2016 — Feb 2017',
    points: [
      'Developed Tracking World App (Android & iOS) — real-time GPS fleet management with live vehicle status, trip history, and Google Maps route plotting.',
      'Built Map My Pakistan (Android) — offline-first crowdsourced POI mapping with voice/photo annotations and background data sync; adopted by nationwide field surveying teams.',
      'Created 1Link ATMs Locator (Android) — nationwide ATM finder via Google Maps with city/branch search.',
      'Developed KE (Karachi Electric) Complaint Management System on in-dash Android units — offline-first, optimised for Edge/2G networks.',
      'Built Tracker Testing tool — in-house IMEI scanning app for field technicians to validate live tracker data.',
      'Awarded Employee of the Month twice for consistently exceptional delivery.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Pineapple Digital Labs – Silico Studios',
    url: 'http://silicostudios.com/',
    location: 'Lahore, Pakistan',
    period: 'Apr 2015 — Dec 2015',
    points: [
      'Developed Weight What Tracker Calculator (Android) — nutrition tracking with 7-day trial, in-app purchase monetisation, and personalised daily point allowances.',
      'Built Receipt All (Android) — receipt capture with image processing, offline SQLite storage, cloud sync, and push-notification reminders.',
      "Created Women's World Cup Canada 2015 (Android) — live scores via custom DOM-parsing of the FIFA website with self-hosted web services.",
      'Developed CricNow Live Cricket Score (Android) — comprehensive cricket companion powered by the LitzScore API.',
    ],
  },
  {
    role: 'Junior Software Engineer',
    company: 'Torque Solutions – Gallant Developers',
    url: 'http://gallant.com.pk/',
    location: 'Lahore, Pakistan',
    period: 'Sep 2014 — Mar 2015',
    points: [
      'Built Android apps, web pages, and PHP APIs for a University Management System and Student Portal.',
      'Developed SLAPPI (in-dash Android) using TCP/IP and SDK integration for server-dispatched route management via background service.',
    ],
  },
];

/**
 * ALL_PROJECTS array — one object per project card.
 *
 * num:       Display number (cosmetic — shown in card top-left)
 * category:  Used by the filter buttons. Must match a value in CATEGORIES.
 * name:      Project title (shown in Playfair Display)
 * company:   Client / employer name
 * domain:    Short descriptor shown below the number
 * desc:      One paragraph professional description
 * tech:      Array of technology tag strings
 * links:     Optional array of { label, url } for public links
 * accent:    Card background colour ON HOVER (dark colours work best
 *            because white text needs to be readable on top)
 * available: false = show "Internal — Not Publicly Available" note
 *            undefined/missing = show links if they exist
 *
 * TO ADD A PROJECT: copy an object, paste it, edit the values.
 * TO REMOVE: delete that object.
 * TO REORDER: drag the objects up or down in the array.
 */
const ALL_PROJECTS = [
  // ── GOVERNMENT PROJECTS ──────────────────────────────────────
  { num:'01', category:'Government', name:'Radar Assets Management System',
    company:'Abu Dhabi Police', domain:'Government · Android · UAE',
    desc:'Enterprise speed radar data collection and technician management system for Abu Dhabi Police. Field engineers record radar asset data on-site, schedule preventive maintenance, and receive real-time task assignments — all with multilingual support and push notifications.',
    tech:['Android','Kotlin','MVVM','Koin','Esri GIS Maps','Firebase','Retrofit','Room','Pagination'],
    accent:'#1A3A5C', available:false },

  { num:'02', category:'Government', name:'Distortion Management System',
    company:'Abu Dhabi Municipality', domain:'Government · Android · UAE',
    desc:'Field inspection and reporting platform for road and park distortions across Abu Dhabi. Officers log geo-tagged incidents, the system routes tasks for resolution, and supervisors monitor city-wide progress — with full RTL/LTR localisation for Arabic and English.',
    tech:['Android','Kotlin','MVVM','Koin','Esri GIS Maps','Firebase','Retrofit','Room','RTL / LTR'],
    accent:'#1E3A2A', available:false },

  { num:'03', category:'Government', name:'Lead DNA — Biometric Collection',
    company:'Ministry of Interior, UAE', domain:'Government · Biometrics · UAE',
    desc:'Secure biometric data collection application for Ministry of Interior UAE. Captures fingerprint, retinal, and barcode data via IDEMIA and ICA SDK-integrated hardware for government employee and volunteer medical sample programmes. Fully offline-capable with Google Maps geo-tagging.',
    tech:['Android','Java','IDEMIA & ICA SDK','Google Maps','SQLite','Offline Mode','Biometrics'],
    accent:'#5C3317', available:false },

  { num:'04', category:'Government', name:'Smart Officer App',
    company:'Rwanda National Police', domain:'Government · React Native · Rwanda',
    desc:'Offline-capable field operations platform for Rwanda National Police. Officers can query vehicle and person records, issue warnings or fines on-the-spot, and construct detailed accident reports with GIF animations and photographic evidence — all without a network connection.',
    tech:['React Native','TypeScript','Redux','Google Maps','Offline Mode','Localization','RTL / LTR'],
    accent:'#1E3A2A', available:false },

  { num:'05', category:'Government', name:'Noor Abu Dhabi',
    company:'Abu Dhabi Municipality', domain:'Government · React Native · UAE',
    desc:'City-wide street lighting asset management platform for Abu Dhabi Municipality. Field teams inspect infrastructure, order replacement parts, and maintain per-pole asset records — all uploaded in real time to a central dashboard for comprehensive citywide oversight.',
    tech:['React Native','TypeScript','Redux Toolkit','Redux-Saga','Google Maps','AsyncStorage','Localization'],
    accent:'#3A2A0A', available:false },

  { num:'06', category:'Government', name:'Emirates Face Recognition API',
    company:'Ministry of Interior, UAE', domain:'Government · .NET API · UAE',
    desc:'High-security facial recognition Web API for Ministry of Interior UAE, built on ASP .NET 7 with structured logging, AutoMapper for clean data-layer separation, and dependency injection throughout.',
    tech:['.NET 7','ASP .NET Core','Dependency Injection','SeriLog','AutoMapper'],
    accent:'#2A1A3A', available:false },

  // ── ENTERTAINMENT ─────────────────────────────────────────────
  { num:'07', category:'Entertainment', name:'Reel Cinemas App',
    company:'Emaar UAE', domain:'Entertainment · React Native · UAE',
    desc:'End-to-end cinema experience platform for Emaar Entertainment. Browse screenings, select seats, order food and beverages, pay via Apple Pay, access bank-exclusive offers, earn loyalty rewards, and manage a personalised profile — all in one app. Led the full project lifecycle from analysis to production deployment on iOS and Android.',
    tech:['React Native','Redux-Saga','Apple Pay','Firebase','Infobip','Google Maps','Axios','Qualtrics'],
    links:[{ label:'Google Play', url:'https://play.google.com/store/apps/details?id=com.reelCinema.Screens' },
           { label:'App Store',   url:'https://apps.apple.com/ae/app/reel-cinemas/id432316358' }],
    accent:'#8B2E1A' },

  // ── REAL ESTATE ───────────────────────────────────────────────
  { num:'08', category:'Real Estate', name:'Agent Companion App',
    company:'Allsopp & Allsopp', domain:'Real Estate · React Native · Dubai',
    desc:"Real-time property agent management platform for one of Dubai's leading real estate agencies. Live GPS tracking via HyperTrack, full viewing schedules, on-site client feedback capture, and live offer review — all integrated with Reapit CRM.",
    tech:['React Native','MobX','HyperTrack API','Reapit API','App Center Push Notifications'],
    links:[{ label:'Google Play', url:'https://play.google.com/store/apps/details?id=com.allsoppandallsopp.agentcompanion' }],
    accent:'#3D2B6B' },

  // ── FINTECH ───────────────────────────────────────────────────
  { num:'09', category:'Fintech', name:'My Card Place (MCP 2.0 / 3.0)',
    company:'i2c Inc.', domain:'Fintech · Android · Global',
    desc:'Multi-flavour prepaid mobile banking platform. Manages fund transfers, transaction alerts, bill payments, and coupon features. Deployed under five brand identities — Comerica Direct Express (US), Australia Post Conext, AC Conversion, AchieveCard, and Golden Nugget — serving millions of users across the US, Australia, and international markets.',
    tech:['Android','Java','MVVM','Retrofit','SQLite','Google Services','Web API'],
    accent:'#1E4D2B' },

  // ── TRACKING & MAPPING ────────────────────────────────────────
  { num:'10', category:'Tracking & Mapping', name:'Tracking World App',
    company:'Tracking World (Pvt.) Ltd.', domain:'Tracking · Android & iOS · Pakistan',
    desc:'Real-time GPS fleet management application. View live vehicle status, mileage, and address data; browse dated trip histories; and plot interactive routes on Google Maps with directional flow, on/off/moving indicators, and per-waypoint speed data.',
    tech:['Android','iOS','Google Maps API','Web API','Android Studio','XCode'],
    links:[{ label:'Google Play', url:'https://play.google.com/store/apps/details?id=pk.com.trackingworld.androidapp' }],
    accent:'#1A4040' },

  { num:'11', category:'Tracking & Mapping', name:'Map My Pakistan',
    company:'Tracking World (Pvt.) Ltd.', domain:'Mapping · Android · Pakistan',
    desc:'Offline-first crowdsourced geospatial platform for nationwide POI and address collection. Surveyors add, edit, and tag locations with voice recordings or photos, view nearby polygon boundaries, and operate without internet — data syncs automatically to the server on reconnection.',
    tech:['Android','Google Maps API','SQLite','Material Design','Web API','Offline-First'],
    links:[{ label:'Google Play', url:'https://play.google.com/store/apps/details?id=com.trackingworld.mapmypakistan' }],
    accent:'#2A3A1A' },

  { num:'12', category:'Tracking & Mapping', name:'1Link ATMs Locator',
    company:'Tracking World (Pvt.) Ltd.', domain:'Fintech · Android · Pakistan',
    desc:'Nationwide ATM discovery app for Pakistan\'s 1LINK network. Find the nearest ATM on Google Maps, search by bank name, city, or branch code, and stay current with an integrated live news feed.',
    tech:['Android','Google Maps API','Web API','HTML','JavaScript'],
    links:[{ label:'Google Play', url:'https://play.google.com/store/apps/details?id=pk.net.onelink.android' }],
    accent:'#1A3A5C' },

  { num:'13', category:'Tracking & Mapping', name:'NADRA Biometric Verification',
    company:'i2c Inc.', domain:'IoT · Biometrics · Pakistan',
    desc:'In-house identity verification app integrating dedicated fingerprint scanning hardware (FP05 & FP06 devices) with the NADRA national identity API — enabling real-time fingerprint capture and government-grade authentication for high-security financial environments.',
    tech:['Android','Biometric SDK (FP05/06)','NADRA API','Hardware Integration'],
    accent:'#3A1A5C' },

  { num:'14', category:'Tracking & Mapping', name:'KE Complaint Management System',
    company:'Tracking World (Pvt.) Ltd.', domain:'Utilities · In-Dash · Pakistan',
    desc:'E2E complaint management for Karachi Electric field technicians on in-dash Android units. Offline-first architecture for Edge/2G networks — technicians receive, track, and update complaint statuses, scan IMEIs via camera, and sync all data to the server automatically on reconnection.',
    tech:['Android','SQLite','Web API','In-Dash Android Unit','TCP/IP','Offline-First'],
    links:[{ label:'Google Play', url:'https://play.google.com/store/apps/details?id=pk.com.trackingworld.android.kescreporter' }],
    accent:'#1A3A1A' },

  { num:'15', category:'Tracking & Mapping', name:'Finger Map (BAS) — Biometric Attendance',
    company:'i2c Inc.', domain:'IoT · Attendance · Pakistan',
    desc:'Enterprise biometric attendance system. Users enrol their fingerprint — the template is stored in SQLite and synced to the server. Check-ins and check-outs are authenticated by fingerprint scan, with all attendance records transmitted including precise Baidu Maps geolocation co-ordinates.',
    tech:['Android','Biometric Device (FP05)','Baidu Maps','Web API','SQLite'],
    accent:'#2A1A3A' },

  // ── CONSUMER / LIFESTYLE ──────────────────────────────────────
  { num:'16', category:'Consumer', name:'Weight What Tracker Calculator',
    company:'Silico Studios', domain:'Health & Fitness · Android',
    desc:'Personal nutrition and fitness tracking app. Build a profile (age, gender, weight, height) to calculate your daily food-point allowance. Log meals to track intake, earn activity points through exercise, and review your full history — with a 7-day free trial and one-time in-app purchase.',
    tech:['Android','SQLite','In-App Purchases','Food Points Formula','Web Services'],
    links:[{ label:'Google Play', url:'https://play.google.com/store/apps/details?id=com.app.weightapp' }],
    accent:'#5C3317' },

  { num:'17', category:'Consumer', name:'Receipt All',
    company:'Silico Studios', domain:'Productivity · Android',
    desc:'Digital receipt manager built from scratch. Capture receipts via camera or gallery, enter supporting details, and the app stores records both on the server and locally in SQLite. Push notifications remind you of important dates, and the app syncs all offline data automatically when connectivity returns.',
    tech:['Android','Image Processing','PHP / MySQL','Google Services','SQLite','Push Notifications'],
    links:[{ label:'Google Play', url:'https://play.google.com/store/apps/details?id=com.silicostudios.receiptall' }],
    accent:'#3A2A1A' },

  { num:'18', category:'Consumer', name:"Women's World Cup Canada 2015",
    company:'Pineapple Digital Labs', domain:'Sports · Android',
    desc:"Real-time sports companion for the FIFA Women's World Cup 2015. Live scores, match fixtures, statistics, and team standings — powered by custom web services built in-house, with live data extracted via a purpose-built HTML DOM-parsing solution applied to the official FIFA website.",
    tech:['Android','HTML DOM Parsing','Web Services','Android Studio'],
    links:[{ label:'Google Play', url:'https://play.google.com/store/apps/details?id=com.pdlapps.WomensWorldCup2015' }],
    accent:'#1A3A5C' },

  { num:'19', category:'Consumer', name:'CricNow Live Cricket Score',
    company:'Silico Studios', domain:'Sports · Android',
    desc:'Comprehensive cricket companion covering Tests, ODIs, and T20Is. Live match scores, full scorecards, player and team rankings, match reports, results, schedules, records (top scorers, wicket-takers, boundaries, sixes), player profiles, and stadium information — powered by the LitzScore API with custom web services for supplementary data.',
    tech:['Android','LitzScore API','SQLite','PHP / MySQL'],
    accent:'#1E4D2B' },
];

/**
 * CATEGORIES — drives the filter buttons in the Projects section.
 * Must include 'All' as the first item.
 * All other strings MUST match the category: field in ALL_PROJECTS above.
 * If they don't match, the filter will show 0 results.
 */
const CATEGORIES = ['All','Government','Entertainment','Real Estate','Fintech','Tracking & Mapping','Consumer'];

/**
 * TICKER_TEXT — items in the scrolling orange marquee bar.
 * Add or remove strings freely. The animation adjusts automatically.
 */
const TICKER_TEXT = [
  'React Native','Android','iOS','.NET APIs','Azure DevOps',
  'CI / CD','Firebase','TypeScript','Esri GIS Maps',
  'Biometric SDK','Lead Developer',/*'H-1B Eligible',*/'19 Apps Shipped',
];

/**
 * AWARDS — displayed in the dark strip between Projects and Contact.
 * fa: Font Awesome icon class.
 */
const AWARDS = [
  { fa:'fa-solid fa-trophy',         title:'Ministry of Interior UAE',    sub:'Appreciation Certificate for Excellence' },
  { fa:'fa-solid fa-star',           title:'Employee of the Month ×2',    sub:'Tracking World, Pvt. Ltd.' },
  { fa:'fa-solid fa-graduation-cap', title:"Dean's Honor Roll ×3",        sub:'2013 · 2014 · 2015 — Pak-AIMS' },
  { fa:'fa-solid fa-medal',          title:'NUST Programming Runner-Up',  sub:'Inter-University Competition 2013' },
];


// ══════════════════════════════════════════════════════════════════
// §5  useScrollReveal — Custom Hook
// ══════════════════════════════════════════════════════════════════
/**
 * A custom hook that watches elements with class "reveal" or
 * "reveal-left" and adds class "visible" when they scroll into view.
 *
 * WHAT IS A CUSTOM HOOK?
 *   A function that starts with "use" and wraps React hooks.
 *   Used to extract and share logic between components.
 *   React Native uses the same pattern — useAsyncStorage,
 *   useWindowDimensions, etc. are all custom hooks.
 *
 * WHAT IS IntersectionObserver?
 *   A browser API that efficiently watches elements and fires
 *   a callback when they enter or leave the visible screen area.
 *
 *   React Native equivalent:
 *     onViewableItemsChanged in FlatList, or
 *     useAnimatedScrollHandler in Reanimated 2.
 *     Both detect element visibility — IntersectionObserver
 *     is the web equivalent.
 *
 * PERFORMANCE: io.unobserve(element)
 *   After an element animates in, we STOP watching it.
 *   Without this, the observer runs continuously for every element
 *   on every scroll event — wasting CPU for animations that already
 *   happened. This is the correct production pattern.
 */
function useScrollReveal() {
  useEffect(() => {
    // Select all elements that should animate on scroll
    const elements = document.querySelectorAll('.reveal, .reveal-left');
    if (!elements.length) return; // Exit if no elements found (performance guard)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // entry.isIntersecting = true when element is in the visible viewport
          if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // triggers CSS transition (§3)
            observer.unobserve(entry.target);      // stop watching — animate once only
          }
        });
      },
      {
        threshold: 0.12,
        // 0.12 = trigger when 12% of the element is visible.
        // Lower values trigger sooner (element barely visible).
        // Higher values trigger later (element mostly visible).

        rootMargin: '0px 0px -40px 0px',
        // Shrinks the "trigger zone" 40px from the bottom.
        // Without this, elements AT the very bottom edge trigger
        // immediately. The -40px makes animation start slightly
        // before the element reaches the screen edge — feels more natural.
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Cleanup: disconnect the observer when the component unmounts.
    // Without this, the observer keeps running even after the component
    // is removed from the DOM → memory leak.
    // React Native analogy: return () => subscription.remove()
    return () => observer.disconnect();
  }); // No dependency array [] intentionally:
      // Runs after every render so newly rendered elements
      // (e.g. project cards after filter change) get observed too.
}

// ══════════════════════════════════════════════════════════════════
// §6  NAVBAR COMPONENT
// ══════════════════════════════════════════════════════════════════
/**
 * Fixed navigation bar at the top of the page.
 *
 * FEATURES:
 *   - Transparent background when on hero section
 *   - Frosted-glass effect after user scrolls past 50px
 *   - Active link underline based on which section is in view
 *   - Hamburger menu on mobile screens (< 768px)
 *
 * PROPS:
 *   active {string} — the id of the section currently in view
 *     e.g. 'hero', 'about', 'skills', 'experience', 'projects', 'contact'
 *     This comes from the root App component (§16) which tracks it.
 *
 * React Native analogy:
 *   <View style={[styles.nav, scrolled && styles.frosted]}>
 *   We're doing the same thing — conditional styles based on state.
 */
function Navbar({ active }) {
  // scrolled: becomes true when user scrolls past 50px.
  // Controls the frosted-glass vs transparent appearance.
  const [scrolled, setScrolled] = useState(false);

  // menuOpen: controls mobile hamburger menu visibility.
  const [menuOpen, setMenuOpen] = useState(false);

  // Attach a scroll event listener when component mounts.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    // { passive: true }: performance optimisation.
    // Tells the browser this listener won't call event.preventDefault().
    // Browser can then start scrolling immediately without waiting
    // for our handler to complete. Prevents janky scrolling.
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup: remove listener when component unmounts.
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // [] = run once on mount, cleanup on unmount

  // useCallback: memoises this function reference.
  // Without useCallback, a NEW function is created on every render.
  // React then thinks the function prop changed → child re-renders.
  // With useCallback, same reference is reused → no needless re-renders.
  // React Native analogy: same pattern, same reason.
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const navLinks = ['About', 'Skills', 'Experience', 'Projects', 'Contact'];

  return (
    <nav
      role="navigation"        // semantic HTML: tells screen readers this is a nav
      aria-label="Main navigation" // names the nav for screen readers
      style={{
        position: 'fixed',     // always at top — same as position: 'absolute' in RN
        top: 0, left: 0, right: 0,
        zIndex: 1000,          // above all other elements
        height: 72,
        padding: '0 5vw',      // 5vw = 5% of viewport width (responsive side padding)
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        // Conditional styles via ternary operator — same pattern as RN:
        // style={[styles.nav, scrolled && styles.scrolled]}
        background:     scrolled ? 'rgba(250,250,247,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        // backdropFilter: blurs everything BEHIND the element.
        // Creates the "frosted glass" effect on scroll.
        // Not available in React Native (iOS uses BlurView library instead).
        borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
        transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
      }}
    >
      {/* Logo mark */}
      <a href="#hero" aria-label="Back to top" style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{
          width:38, height:38, borderRadius:'50%', background:C.accent, flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:'#fff',
        }}>DZ</div>
        <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:16, color:C.ink }}>
          Danish Zubair
        </span>
      </a>

      {/* Desktop navigation links — hidden on mobile via CSS .desktop-nav */}
      <div className="desktop-nav" style={{ display:'flex', alignItems:'center', gap:36 }}>
        {navLinks.map((link) => (
          <a
            key={link}                        // key: required for React list items
            href={`#${link.toLowerCase()}`}   // #about, #skills, etc. — browser scrolls there
            style={{
              fontSize:14, fontWeight:500, position:'relative',
              // Active link gets accent colour; others get muted ink colour.
              color: active === link.toLowerCase() ? C.accent : C.inkLight,
              transition: 'color 0.2s',
            }}
          >
            {link}
            {/* Orange underline shown only for the currently-active section */}
            {active === link.toLowerCase() && (
              <span style={{
                position:'absolute', bottom:-4, left:0, right:0,
                height:2, borderRadius:2, background:C.accent,
              }} />
            )}
          </a>
        ))}
        <a href="mailto:danithedeveloper@gmail.com" className="btn-primary" style={{ padding:'9px 22px', fontSize:13 }}>
          Hire Me
        </a>
      </div>

      {/* Hamburger button — shown only on mobile via CSS .hamburger */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen((prev) => !prev)} // toggle: open ↔ closed
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}   // accessibility: tells screen readers menu state
        style={{ display:'none', flexDirection:'column', gap:5, padding:8 }}
      >
        {[0,1,2].map((i) => (
          <span key={i} style={{ display:'block', width:24, height:2, background:C.ink, borderRadius:2 }} />
        ))}
      </button>

      {/* Mobile dropdown — only renders (is added to DOM) when menuOpen is true */}
      {menuOpen && (
        <div style={{
          position:'fixed', top:72, left:0, right:0,
          background:C.white, borderBottom:`1px solid ${C.border}`,
          padding:'24px 5vw 28px',
          display:'flex', flexDirection:'column', gap:22,
          zIndex:999,
          animation:'fadeIn 0.2s ease',  // fade in when it appears
        }}>
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={closeMenu}
               style={{ fontSize:17, fontWeight:500, color:C.ink }}>
              {link}
            </a>
          ))}
          <a href="mailto:danithedeveloper@gmail.com" onClick={closeMenu}
             className="btn-primary" style={{ textAlign:'center', marginTop:4 }}>
            Hire Me
          </a>
        </div>
      )}
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════════
// §7  HERO COMPONENT
// ══════════════════════════════════════════════════════════════════
/**
 * The first full-screen section visitors see.
 *
 * CONTAINS (left side):
 *   - Status badge ("Available for US Opportunities")
 *   - Your name (Playfair Display, large)
 *   - Subtitle
 *   - Description paragraph
 *   - Two CTA buttons
 *   - Four stats (10+ years, 19 apps, etc.)
 *
 * CONTAINS (right side, hidden on mobile):
 *   - Your profile photo in a circular frame
 *   - Four floating tech-tag pills
 *   - Decorative background circles
 *
 * No props — all content is hardcoded or from the C tokens above.
 */
function Hero() {
  const stats = [
    { num: '10+', label: 'Years Experience' },
    { num: '19',  label: 'Apps Shipped'     },
    { num: '8',   label: 'Companies'        },
    { num: '3',   label: 'Countries'        },
  ];

  return (
    <section
      id="hero"
      // minHeight: '100vh' = at minimum, fills 100% of screen height.
      // vh = viewport height. 100vh = full screen height.
      style={{ minHeight:'100vh', display:'flex', alignItems:'center', padding:'120px 5vw 80px', position:'relative', overflow:'hidden', background:C.cream }}
    >
      {/* ── Decorative background rings (aria-hidden = screen readers skip) ── */}
      <div aria-hidden="true" style={{ position:'absolute', right:'-8vw', top:'8%', width:'min(580px,58vw)', height:'min(580px,58vw)', borderRadius:'50%', border:`1px solid ${C.border}`, animation:'floatY 9s ease-in-out infinite', pointerEvents:'none' }} />
      <div aria-hidden="true" style={{ position:'absolute', right:'2vw', top:'18%', width:'min(380px,38vw)', height:'min(380px,38vw)', borderRadius:'50%', background:`radial-gradient(circle,${C.accentBg} 0%,transparent 70%)`, animation:'floatY 12s ease-in-out infinite reverse', pointerEvents:'none' }} />

      {/* ── Right side: photo + floating tags (hidden on narrow screens via .hero-floats CSS) ── */}
      <div className="hero-floats" aria-hidden="true">

        {/* Profile photo */}
        <div style={{
          position:'absolute', top:'50%', right:'7vw',
          // floatPhoto keyframe: handles BOTH centring (-50%) and floating.
          // See @keyframes floatPhoto explanation in §3 GlobalStyle above.
          animation:'floatPhoto 9s ease-in-out infinite',
          zIndex:2,
        }}>
          {/* Outer gradient ring — conic-gradient creates a colour-wheel effect */}
          <div style={{ width:290, height:290, borderRadius:'50%', padding:5, background:`conic-gradient(${C.accent} 0deg,${C.accentSoft} 180deg,${C.accentBg} 360deg)`, boxShadow:`0 24px 64px rgba(224,92,42,0.22)` }}>
            {/* White inner gap between ring and photo */}
            <div style={{ width:'100%', height:'100%', borderRadius:'50%', padding:4, background:C.white }}>
              {/*
               * YOUR PROFILE PHOTO
               * ─────────────────────────────────────────────
               * TO ADD YOUR PHOTO:
               *   1. Rename your headshot file to: profile.jpg
               *   2. Drop it into the /public folder
               *   3. src="/profile.jpg" finds it automatically
               *
               * objectFit: 'cover'        → fills circle without stretching
               * objectPosition: 'center top' → shows the face (top of image)
               *   Change to 'center center' for full-body shots
               *
               * onError: if profile.jpg is missing, show "DZ" initials
               * instead of a broken image icon. Graceful fallback.
               */}
              <img
                src="/profile.jpg"
                alt="Hafiz Danish Zubair — Lead Software Developer"
                style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover', objectPosition:'center top', display:'block' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.style.background = C.accentBg;
                  e.currentTarget.parentElement.innerHTML = `<div style="width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:64px;font-weight:700;color:${C.accent}">DZ</div>`;
                }}
              />
            </div>
          </div>
          {/* Small orange dot decorating the bottom-right of the photo circle */}
          <div style={{ position:'absolute', bottom:16, right:4, width:22, height:22, borderRadius:'50%', background:C.accent, border:`3px solid ${C.white}` }} />
        </div>

        {/* Floating tech tag pills — positioned around the photo */}
        {[
          { text:'React Native', top:'16%', right:'28%', delay:'0s'   },
          { text:'Android',      top:'34%', right:'2%',  delay:'0.5s' },
          { text:'iOS',          top:'56%', right:'30%', delay:'1s'   },
          { text:'.NET APIs',    top:'74%', right:'3%',  delay:'1.5s' },
        ].map((tag) => (
          <div key={tag.text} style={{
            position:'absolute', top:tag.top, right:tag.right,
            background:C.white, border:`1px solid ${C.border}`,
            padding:'7px 16px', borderRadius:100,
            fontSize:12, fontWeight:500, color:C.muted,
            boxShadow:'0 4px 18px rgba(0,0,0,0.06)',
            // Each tag gets the SAME animation but a different delay.
            // This creates a staggered, organic floating rhythm.
            animation:`floatY 6s ease-in-out ${tag.delay} infinite`,
            pointerEvents:'none',
          }}>
            {tag.text}
          </div>
        ))}
      </div>

      {/* ── Left side: text content ── */}
      <div style={{ maxWidth:800, position:'relative', zIndex:2 }}>

        {/* Status badge */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:10,
          background:C.accentBg, border:`1px solid ${C.accentSoft}`,
          borderRadius:100, padding:'6px 18px', marginBottom:32,
          // animation shorthand: name duration easing delay fill-mode
          // 'both' = apply animation state before AND after it plays
          animation:'fadeIn 0.7s ease both',
        }}>
          {/* Pulsing green dot — signals "available" */}
          <span style={{ width:8, height:8, borderRadius:'50%', background:C.green, boxShadow:'0 0 0 3px rgba(45,122,79,0.22)' }} />
          {/*<span style={{ fontSize:13, fontWeight:500, color:C.accent }}>
            Available for US Opportunities · H-1B Transfer Eligible
          </span>*/}
        </div>

        {/* Name — largest text on the page */}
        <h1 style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:'clamp(50px,7vw,94px)',
          fontWeight:900, lineHeight:1.0, letterSpacing:'-2px',
          color:C.ink, marginBottom:16,
          // Staggered animation: 0.1s delay so it appears AFTER the badge above
          animation:'fadeUp 0.8s ease 0.1s both',
        }}>
          Hafiz Danish<br />
          {/* <em> = italic (semantic "emphasis"). Used here for visual style. */}
          <em style={{ color:C.accent, fontStyle:'italic' }}>Zubair</em>
        </h1>

        <p style={{ fontSize:'clamp(17px,2.2vw,22px)', fontWeight:300, color:C.muted, marginBottom:28, animation:'fadeUp 0.8s ease 0.2s both' }}>
          Lead Software Developer · Mobile Applications ·{' '}
          {/* {' '} inserts a space — JSX collapses whitespace between elements */}
          <span style={{ color:C.ink }}>Abu Dhabi, UAE</span>
        </p>

        <p style={{ fontSize:16, lineHeight:1.85, color:C.muted, maxWidth:560, marginBottom:48, animation:'fadeUp 0.8s ease 0.3s both' }}>
          10+ years shipping <strong style={{ color:C.ink }}>React Native, Android & iOS</strong> products across government, fintech, real estate, and entertainment. Currently leading mobile innovation at the <strong style={{ color:C.ink }}>Ministry of Interior, UAE</strong>.
        </p>

        {/* CTA buttons */}
        <div style={{ display:'flex', gap:16, flexWrap:'wrap', animation:'fadeUp 0.8s ease 0.4s both' }}>
          <a href="#projects" className="btn-primary">
            View Projects <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
          <a href="#contact" className="btn-outline">Get in Touch</a>
        </div>

        {/* Stats row */}
        <div style={{
          display:'flex', gap:'clamp(24px,4vw,60px)', flexWrap:'wrap',
          marginTop:64, paddingTop:40,
          borderTop:`1px solid ${C.border}`,  // horizontal divider line
          animation:'fadeUp 0.8s ease 0.5s both',
        }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,4vw,44px)', fontWeight:700, color:C.ink, lineHeight:1 }}>
                {s.num}
              </div>
              <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// §8  TICKER COMPONENT — scrolling skills marquee
// ══════════════════════════════════════════════════════════════════
/**
 * Orange bar with skill names continuously scrolling left to right.
 *
 * SEAMLESS LOOP TECHNIQUE:
 *   We duplicate the TICKER_TEXT array: [...text, ...text]
 *   The CSS animation moves all content -50% (one copy's width).
 *   When the animation resets to 0, the second copy is aligned
 *   identically to how the first copy started → seamless loop.
 *
 * The content width MUST be set to 'max-content' so it grows
 * wide enough to hold ALL items on one line (no wrapping).
 */
function Ticker() {
  const doubled = [...TICKER_TEXT, ...TICKER_TEXT]; // duplicate for seamless loop
  return (
    <div style={{ background:C.accent, overflow:'hidden', padding:'13px 0' }}>
      <div style={{
        display:'flex',
        width:'max-content',              // grow to fit all content on one line
        animation:'ticker 30s linear infinite', // 30s = one full cycle. Increase to slow down.
        // 'linear' = constant speed (not ease in/out — that would look jerky for a marquee)
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontSize:12, fontWeight:600, color:'#fff',
            letterSpacing:'0.08em', textTransform:'uppercase',
            padding:'0 20px', whiteSpace:'nowrap',
            display:'inline-flex', alignItems:'center', gap:20,
          }}>
            {item}
            {/* Diamond separator between items — not shown after the very last item */}
            {i < doubled.length - 1 && <span style={{ opacity:0.4, fontSize:10 }}>✦</span>}
          </span>
        ))}
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════
// §9  ABOUT COMPONENT
// ══════════════════════════════════════════════════════════════════
/**
 * Two-column layout: decorative phone mockup on left, text on right.
 * On screens narrower than 900px, stacks to single column
 * via the .about-grid @media rule in GlobalStyle (§3).
 *
 * No props — content is from constants and hardcoded text.
 */
function About() {
  return (
    <section id="about" style={{ padding:'100px 5vw', background:C.white }}>
      <div
        className="about-grid"  // target of @media (max-width:900px) → 1 column
        style={{
          maxWidth:1200, margin:'0 auto',
          display:'grid',
          // CSS Grid: two equal columns.
          // React Native equivalent:
          //   <View style={{ flexDirection: 'row' }}>
          //     <View style={{ flex: 1 }}>...</View>
          //     <View style={{ flex: 1 }}>...</View>
          //   </View>
          gridTemplateColumns:'1fr 1fr',
          gap:'clamp(40px,6vw,100px)', // responsive gap (shrinks on smaller screens)
          alignItems:'center',
        }}
      >
        {/* ── Left column: visual ── */}
        <div className="reveal-left" style={{ position:'relative' }}>
          {/* Gradient background card */}
          <div style={{
            width:'100%',
            paddingBottom:'112%',
            // paddingBottom as percentage creates an aspect-ratio trick:
            // paddingBottom:112% means height = 112% of width.
            // This keeps the card taller than wide at any screen size.
            // React Native equivalent: <View style={{ aspectRatio: 100/112 }}>
            background:`linear-gradient(145deg,${C.accentBg} 0%,${C.border} 100%)`,
            borderRadius:24, position:'relative', overflow:'hidden',
          }}>
            {/* Phone mockup — absolutely positioned in the centre of the card */}
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:152, height:274, background:C.white, borderRadius:30, border:`3px solid ${C.ink}`, overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 40px 80px rgba(0,0,0,0.14)' }}>
                {/* Phone status bar */}
                <div style={{ height:22, background:C.ink, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:36, height:7, borderRadius:4, background:'rgba(255,255,255,0.25)' }} />
                </div>
                {/* Abstract "app screen" — coloured bars representing UI elements */}
                <div style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:7 }}>
                  <div style={{ height:9, background:C.accent, borderRadius:4 }} />
                  <div style={{ height:7, background:C.border, borderRadius:4, width:'75%' }} />
                  <div style={{ height:7, background:C.border, borderRadius:4, width:'55%' }} />
                  <div style={{ display:'flex', gap:6, marginTop:2 }}>
                    {[C.accent,C.accentBg,C.tag].map((bg,i) => <div key={i} style={{ flex:1, height:46, background:bg, borderRadius:8 }} />)}
                  </div>
                  {['100%','80%','60%'].map((w,i) => <div key={i} style={{ height:7, background:i===0?C.border:C.tag, borderRadius:4, width:w }} />)}
                  <div style={{ height:14, background:C.accent, borderRadius:8, marginTop:6 }} />
                </div>
                {/* Home indicator bar (iPhone style) */}
                <div style={{ height:18, background:C.ink, margin:'0 18px 12px', borderRadius:9 }} />
              </div>
            </div>
          </div>

          {/* "10+ Years" badge — overlapping the card's bottom-right corner */}
          <div style={{ position:'absolute', bottom:-18, right:-18, background:C.accent, color:'#fff', padding:'18px 26px', borderRadius:18, boxShadow:'0 16px 48px rgba(224,92,42,0.38)' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, lineHeight:1 }}>10+</div>
            <div style={{ fontSize:12, opacity:.9, marginTop:3 }}>Years Building Apps</div>
          </div>

          {/* Award badge — overlapping the card's top-left corner */}
          <div style={{ position:'absolute', top:-14, left:-14, background:C.white, border:`1px solid ${C.border}`, padding:'11px 18px', borderRadius:14, boxShadow:'0 6px 24px rgba(0,0,0,0.08)', display:'flex', alignItems:'center', gap:10 }}>
            <i className="fa-solid fa-trophy" style={{ fontSize:20, color:'#F0A500' }} aria-hidden="true" />
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:C.ink }}>Ministry of Interior</div>
              <div style={{ fontSize:11, color:C.muted }}>Excellence Award</div>
            </div>
          </div>
        </div>

        {/* ── Right column: text ── */}
        <div>
          <div className="pill reveal">About Me</div>
          <h2 className="section-h reveal" style={{ marginBottom:22 }}>
            A developer who leads<br />
            <em style={{ color:C.accent }}>& ships.</em>
          </h2>
          <p className="reveal" style={{ fontSize:15, lineHeight:1.88, color:C.muted, marginBottom:18 }}>
            I'm a <strong style={{ color:C.ink }}>Lead Software Developer</strong> based in Abu Dhabi, UAE — 10+ years designing, building, and shipping mobile applications across government, fintech, real estate, entertainment, and IoT. Holder of the UAE Golden Visa.
          </p>
          <p className="reveal" style={{ fontSize:15, lineHeight:1.88, color:C.muted, marginBottom:34 }}>
            At <strong style={{ color:C.ink }}>Tatweer (Ministry of Interior, UAE)</strong>, I lead mission-critical apps for Abu Dhabi Police and Municipality. Previously shipped products for <strong style={{ color:C.ink }}>Emaar, Allsopp & Allsopp, i2c Inc., Rwanda National Police</strong>, and more.
          </p>

          {/* 2x2 info grid */}
          <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:34 }}>
            {[
              { label:'Location',       value:'Abu Dhabi, UAE' },
              { label:'Specialization', value:'Mobile + APIs' },
              { label:'Education',      value:'B.S. (Hons) CS — 3.04 GPA' },
              /*{ label:'US Visa',        value:'H-1B Transfer Eligible', highlight:true },*/
            ].map((row) => (
              <div key={row.label} style={{ padding:'14px 18px', background:C.cream, borderRadius:12, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{row.label}</div>
                {/* highlight:true → use accent orange colour for the H-1B value */}
                <div style={{ fontSize:13, fontWeight:600, color:row.highlight?C.accent:C.ink }}>{row.value}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="reveal" style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            <a href="mailto:danithedeveloper@gmail.com" className="btn-primary">
              <i className="fa-solid fa-envelope" aria-hidden="true" /> Contact Me
            </a>
            <a href="https://www.linkedin.com/in/hafiz-danish-zubair-384833103/" target="_blank" rel="noreferrer" className="btn-outline">
              <i className="fa-brands fa-linkedin" aria-hidden="true" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// §10  SKILLS COMPONENT
// ══════════════════════════════════════════════════════════════════
/**
 * 6-card grid showing your tech stack categories.
 *
 * HOVER EFFECT:
 *   Card background flips dark, title/tags turn white.
 *   Most of this is handled by CSS (.skill-card:hover in GlobalStyle §3).
 *   The icon colour still uses JS state because each icon has a
 *   different brand colour that can't be put in a static CSS string.
 *
 * cornerRadius array:
 *   Creates the visual effect of the 6 cards being one large
 *   rounded rectangle by adding radius only to the outer corners.
 *   Index: 0=top-left, 1=top-center, 2=top-right,
 *          3=bottom-left, 4=bottom-center, 5=bottom-right
 */
function Skills() {
  // null = no card hovered. Number = index of the hovered card.
  const [hovered, setHovered] = useState(null);

  const cornerRadius = ['16px 0 0 0','0','0 16px 0 0','0 0 0 16px','0','0 0 16px 0'];

  return (
    <section id="skills" style={{ padding:'100px 5vw', background:C.cream }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div className="pill reveal">Technical Skills</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:56, flexWrap:'wrap', gap:20 }}>
          <h2 className="section-h reveal">My Tech Stack</h2>
          <p className="reveal" style={{ fontSize:15, color:C.muted, maxWidth:340, lineHeight:1.75 }}>
            A decade of hands-on experience across the full mobile development spectrum.
          </p>
        </div>

        {/*
          CSS Grid with auto-fit and minmax:
          - auto-fit: create as many columns as WILL FIT in the container
          - minmax(300px, 1fr): each column is at least 300px, maximum 1 fraction
          - Result: 3 columns on wide screens, 2 on tablet, 1 on phone
          - gap:2 creates a very tight 2px gap between cards
        */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:2 }}>
          {SKILLS.map(({ fa, iconColor, title, tags }, i) => (
            <div
              key={title}
              className="skill-card reveal"  // CSS :hover effects defined in §3
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ background:C.white, padding:'34px 30px', borderRadius:cornerRadius[i]||'0' }}
            >
              {/* Icon — className="sk-icon" lets CSS make it white on hover */}
              <div className="sk-icon" style={{ marginBottom:16, fontSize:30, color:iconColor, transition:'color 0.3s' }}>
                <i className={fa} aria-hidden="true" />
              </div>

              {/* Title — className="sk-title" lets CSS make it white on hover */}
              <div className="sk-title" style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700, color:C.ink, marginBottom:18, transition:'color 0.3s' }}>
                {title}
              </div>

              {/* Tags — className="sk-tag" lets CSS change their bg/colour on hover */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                {tags.map((tag) => (
                  <span key={tag} className="sk-tag" style={{ fontSize:11, padding:'4px 12px', borderRadius:100, background:C.tag, border:`1px solid ${C.border}`, color:C.muted, transition:'all 0.3s' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// §11  EXPERIENCE COMPONENT — accordion job history
// ══════════════════════════════════════════════════════════════════
/**
 * Clickable accordion list of work history.
 * Tapping a row expands its bullet points. Only one row open at a time.
 *
 * ACCORDION ANIMATION TECHNIQUE:
 *   maxHeight: 0    → row is collapsed (height = 0, content invisible)
 *   maxHeight: 800  → row is expanded (enough room for all content)
 *   overflow: hidden → content is clipped when maxHeight < content height
 *   transition: 'max-height 0.42s ease' → smoothly animates between states
 *
 * WHY maxHeight and NOT height?
 *   CSS cannot transition TO or FROM height: 'auto'.
 *   Setting a large fixed max-height value is the standard workaround.
 *   Pick a value larger than the tallest possible content.
 *
 * React Native equivalent:
 *   Animated.timing on height, or LayoutAnimation.configureNext()
 */
function Experience() {
  // openIdx: which accordion row is open (-1 = none open)
  // Default 0 = first item (current job) is open on first render
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = useCallback(
    (i) => setOpenIdx((prev) => (prev === i ? -1 : i)),
    [] // No dependencies — this function never needs to change
  );

  return (
    <section id="experience" style={{ padding:'100px 5vw', background:C.white }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div className="pill reveal">Career Journey</div>
        <h2 className="section-h reveal" style={{ marginBottom:60 }}>Work Experience</h2>

        {/* role="list" + role="listitem": accessibility — screen readers announce the list */}
        <div role="list">
          {EXPERIENCE.map((job, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="reveal" role="listitem"
                style={{ borderTop:`1px solid ${C.border}`, ...(i===EXPERIENCE.length-1?{borderBottom:`1px solid ${C.border}`}:{}) }}>

                {/* ── Accordion header row (clickable) ── */}
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen} // accessibility: tells screen reader if content is open
                  style={{ width:'100%', textAlign:'left', padding:'26px 0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:20 }}
                >
                  {/* Left: role + company link + "Current" badge */}
                  <div style={{ display:'flex', alignItems:'center', gap:16, flex:1, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(15px,1.8vw,20px)', fontWeight:700, color:isOpen?C.accent:C.ink, transition:'color 0.2s' }}>
                      {job.role}
                    </span>
                    {/*
                      e.stopPropagation(): prevents clicking the company link
                      from also triggering the accordion toggle.
                      Without this, clicking the link would open a new tab
                      AND toggle the accordion simultaneously.
                    */}
                    <a href={job.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize:13, color:C.accent, fontWeight:500 }}>
                      {job.company} <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize:10 }} aria-hidden="true" />
                    </a>
                    {job.current && (
                      <span style={{ fontSize:11, fontWeight:600, color:C.green, background:'rgba(45,122,79,0.1)', padding:'3px 10px', borderRadius:100 }}>
                        <i className="fa-solid fa-circle" style={{ fontSize:7, marginRight:5 }} aria-hidden="true" />Current
                      </span>
                    )}
                  </div>

                  {/* Right: date range + plus/minus icon */}
                  <div style={{ display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
                    <span style={{ fontSize:12, color:C.muted, whiteSpace:'nowrap' }}>{job.period}</span>
                    <span style={{ width:30, height:30, borderRadius:'50%', border:`1.5px solid ${isOpen?C.accent:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:isOpen?C.accent:C.muted, transition:'all 0.2s', flexShrink:0 }}>
                      {/* Icon switches between + and - based on open state */}
                      <i className={`fa-solid fa-${isOpen?'minus':'plus'}`} style={{ fontSize:12 }} aria-hidden="true" />
                    </span>
                  </div>
                </button>

                {/* ── Accordion body (the expandable bullet points) ── */}
                <div style={{ maxHeight:isOpen?800:0, overflow:'hidden', transition:'max-height 0.42s ease' }}>
                  <div style={{ paddingBottom:28 }}>
                    <div style={{ fontSize:12, color:C.accent, fontWeight:500, marginBottom:14 }}>
                      <i className="fa-solid fa-location-dot" style={{ marginRight:6 }} aria-hidden="true" />
                      {job.location}
                    </div>
                    <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                      {job.points.map((point, j) => (
                        <li key={j} style={{ display:'flex', gap:12, fontSize:14, color:C.muted, lineHeight:1.75 }}>
                          <i className="fa-solid fa-arrow-right" style={{ color:C.accent, flexShrink:0, marginTop:4, fontSize:12 }} aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// §12  PROJECTS COMPONENT — filterable cards grid
// ══════════════════════════════════════════════════════════════════
/**
 * Shows all 19 projects as cards with a category filter bar at the top.
 *
 * FILTERING LOGIC:
 *   activeFilter === 'All' → show ALL_PROJECTS (no filter)
 *   otherwise → Array.filter() keeps only cards matching the category
 *
 * HOVER STATE:
 *   hovered === i → this card is being hovered
 *   Card background changes to the project's accent colour.
 *   Text becomes white for readability on the dark background.
 *   This uses JS state (not CSS :hover) because the colour is
 *   different for every card (comes from the data's accent field).
 *
 * GOVERNMENT PROJECTS:
 *   available: false → shows a lock icon and "Internal" note
 *   instead of store links. This is factually correct (you worked
 *   on them) and legally safe (doesn't misrepresent availability).
 */
function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [hovered, setHovered] = useState(null);

  // Filter logic:
  // If 'All', return the full array.
  // Otherwise, keep only projects whose category matches the filter.
  const filtered = activeFilter === 'All'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" style={{ padding:'100px 5vw', background:C.cream }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>

        {/* Section header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40, flexWrap:'wrap', gap:20 }}>
          <div>
            <div className="pill reveal">Portfolio</div>
            <h2 className="section-h reveal">All Projects</h2>
          </div>
          <p className="reveal" style={{ fontSize:15, color:C.muted, maxWidth:280, lineHeight:1.75 }}>
            19 shipped projects across 6 domains.
          </p>
        </div>

        {/* ── Filter buttons ── */}
        <div className="reveal" style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:48 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              // When clicked: update activeFilter AND reset hovered to null
              // (so a card from a previous filter isn't stuck in hovered state)
              onClick={() => { setActiveFilter(cat); setHovered(null); }}
              // Conditionally add 'active' class — CSS .filter-btn.active turns it orange
              className={`filter-btn${activeFilter === cat ? ' active' : ''}`}
              style={{
                fontSize:12, fontWeight:600, padding:'8px 18px', borderRadius:100,
                border:`1.5px solid ${activeFilter===cat?C.accent:C.border}`,
                background:activeFilter===cat?C.accent:C.white,
                color:activeFilter===cat?'#fff':C.muted,
                cursor:'pointer', letterSpacing:'0.03em',
              }}
            >
              {/* Show count in parentheses e.g. "Government (6)" */}
              {cat}{cat!=='All'
                ? ` (${ALL_PROJECTS.filter(p=>p.category===cat).length})`
                : ` (${ALL_PROJECTS.length})`
              }
            </button>
          ))}
        </div>

        {/* ── Project cards grid ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
          {filtered.map((project, i) => {
            const isHovered = hovered === i;
            return (
              <article
                key={project.num}
                className="proj-card reveal"   // CSS handles the translateY(-7px) lift
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  // When hovered: deep colour from project.accent. When not: white.
                  background: isHovered ? project.accent : C.white,
                  borderRadius:20, padding:32,
                  border:`1px solid ${isHovered?'transparent':C.border}`,
                  boxShadow: isHovered ? '0 32px 64px rgba(0,0,0,0.18)' : '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                {/* Card header: number + category badge + arrow icon */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                  <div>
                    <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.05em', color:isHovered?'rgba(255,255,255,0.45)':C.muted }}>
                      {project.num}
                    </span>
                    {/* Small category badge chip */}
                    <span style={{ fontSize:11, marginTop:4, padding:'2px 8px', borderRadius:100, display:'inline-block', background:isHovered?'rgba(255,255,255,0.15)':C.tag, color:isHovered?'rgba(255,255,255,0.8)':C.muted, marginLeft:8, fontWeight:500 }}>
                      {project.category}
                    </span>
                  </div>
                  <span style={{ width:36, height:36, borderRadius:'50%', border:`1px solid ${isHovered?'rgba(255,255,255,0.22)':C.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:isHovered?'#fff':C.muted, transition:'all 0.3s', flexShrink:0 }}>
                    <i className="fa-solid fa-arrow-up-right" style={{ fontSize:12 }} aria-hidden="true" />
                  </span>
                </div>

                <div style={{ fontSize:11, fontWeight:500, marginBottom:6, color:isHovered?C.accentSoft:C.accent }}>{project.domain}</div>
                {project.company && <div style={{ fontSize:12, color:isHovered?'rgba(255,255,255,0.55)':C.muted, marginBottom:8, fontWeight:500 }}>@ {project.company}</div>}

                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700, lineHeight:1.2, color:isHovered?'#fff':C.ink, marginBottom:12 }}>
                  {project.name}
                </h3>

                <p style={{ fontSize:13, lineHeight:1.75, color:isHovered?'rgba(255,255,255,0.72)':C.muted, marginBottom:18 }}>
                  {project.desc}
                </p>

                {/* Tech tags */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:project.links||project.available===false?16:0 }}>
                  {project.tech.map((t) => (
                    <span key={t} style={{ fontSize:11, padding:'3px 10px', borderRadius:100, background:isHovered?'rgba(255,255,255,0.13)':C.tag, border:`1px solid ${isHovered?'rgba(255,255,255,0.16)':C.border}`, color:isHovered?'rgba(255,255,255,0.84)':C.muted, transition:'all 0.3s' }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Footer: either "Internal" note or store links */}
                {project.available === false
                  ? (
                    // Government/internal projects — show a factual note
                    <div style={{ fontSize:11, color:isHovered?'rgba(255,255,255,0.45)':C.muted, fontStyle:'italic', marginTop:4 }}>
                      <i className="fa-solid fa-lock" style={{ marginRight:5, fontSize:10 }} aria-hidden="true" />
                      Internal / Government — Not Publicly Available
                    </div>
                  ) : project.links ? (
                    // Public projects — show store links
                    <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                      {project.links.map((link) => (
                        <a key={link.label} href={link.url} target="_blank" rel="noreferrer"
                           style={{ fontSize:12, fontWeight:600, color:isHovered?'#fff':C.accent, display:'inline-flex', alignItems:'center', gap:4 }}>
                          <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize:10 }} aria-hidden="true" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null  // No links and not marked internal — show nothing
                }
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// §13  AWARDS BAR
// ══════════════════════════════════════════════════════════════════
/**
 * Dark background strip displaying 4 achievement items.
 * Simple layout — no interactivity needed.
 * The awards-grid class changes from 4 → 2 → 1 columns
 * via @media queries in GlobalStyle (§3).
 */
function AwardsBar() {
  return (
    <section aria-label="Awards and recognition" style={{ background:C.ink }}>
      <div className="awards-grid" style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
        {AWARDS.map((award, i) => (
          <div key={i} className="reveal" style={{
            padding:'44px 32px',
            // Thin vertical border between items (none on the last one)
            borderRight: i < AWARDS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
          }}>
            <i className={award.fa} style={{ fontSize:30, color:C.accentSoft, marginBottom:16, display:'block' }} aria-hidden="true" />
            <div style={{ fontSize:15, fontWeight:600, color:'#fff', marginBottom:6 }}>{award.title}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.42)' }}>{award.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// §14  CONTACT COMPONENT
// ══════════════════════════════════════════════════════════════════
/**
 * Centered contact section with email link and social buttons.
 *
 * mailto: link → opens the user's default email app when clicked.
 * React Native equivalent: Linking.openURL('mailto:...')
 *
 * target="_blank" → opens in a new browser tab.
 * rel="noreferrer" → security: doesn't send the current page URL
 *   to the destination site as a "referrer" header. Best practice
 *   for any external link.
 */
function Contact() {
  const socials = [
    { fa:'fa-brands fa-linkedin', label:'LinkedIn',         href:'https://www.linkedin.com/in/hafiz-danish-zubair-384833103/' },
    { fa:'fa-brands fa-github',   label:'GitHub',           href:'https://github.com/danithedeveloper' },
    { fa:'fa-solid fa-phone',     label:'+971 58 907 6726', href:'tel:+971589076726' },
  ];
  return (
    <section id="contact" style={{ padding:'120px 5vw', background:C.white, textAlign:'center' }}>
      <div style={{ maxWidth:860, margin:'0 auto' }}>
        <div className="pill reveal">Contact</div>
        <h2 className="section-h reveal" style={{ fontSize:'clamp(36px,6vw,76px)', letterSpacing:'-2px', marginBottom:24 }}>
          Let's build<br /><em style={{ color:C.accent }}>something great.</em>
        </h2>
        {/*<p className="reveal" style={{ fontSize:16, color:C.muted, lineHeight:1.88, maxWidth:500, margin:'0 auto 52px' }}>
          Open to senior / lead engineering roles in the US.<br />H-1B transfer eligible — no lottery wait.
        </p>*/}

        {/* Large email address as a clickable underlined link */}
        <a
          href="mailto:danithedeveloper@gmail.com"
          className="reveal"
          style={{ display:'inline-block', fontFamily:"'Playfair Display',serif", fontSize:'clamp(18px,3vw,32px)', fontWeight:700, color:C.ink, borderBottom:`3px solid ${C.accent}`, paddingBottom:4, marginBottom:60, transition:'color 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.ink)}
        >
          danithedeveloper@gmail.com
        </a>

        {/* Social / contact pill links */}
        <div className="reveal" style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
               className="contact-link"  // CSS hover defined in §3
               style={{ fontSize:13, fontWeight:500, color:C.muted, border:`1.5px solid ${C.border}`, padding:'10px 24px', borderRadius:100, display:'inline-flex', alignItems:'center', gap:8 }}>
              <i className={s.fa} aria-hidden="true" />
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// §15  FOOTER
// ══════════════════════════════════════════════════════════════════
/**
 * Minimal bottom strip.
 * new Date().getFullYear() → always shows the current year automatically.
 * No need to manually update the copyright year every January.
 */
function Footer() {
  return (
    <footer style={{ padding:'26px 5vw', borderTop:`1px solid ${C.border}`, background:C.cream, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10, fontSize:12, color:C.muted }}>
      <span>© {new Date().getFullYear()} Hafiz Danish Zubair</span>
      <span>Lead Software Developer · Abu Dhabi, UAE</span>
      <a href="mailto:danithedeveloper@gmail.com" style={{ color:C.accent, fontWeight:500 }}>danithedeveloper@gmail.com</a>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════
// §16  ROOT APP COMPONENT
// ══════════════════════════════════════════════════════════════════
/**
 * The root component. This is what src/index.js renders.
 * Think of it as the main() function of the whole app.
 *
 * TWO JOBS:
 *   1. Track which section is in the viewport → pass to Navbar
 *   2. Assemble all section components in order
 *
 * HOW ACTIVE SECTION TRACKING WORKS:
 *   We create an IntersectionObserver that watches all <section id="..."> elements.
 *   When a section is 35% visible, we set it as the activeSection.
 *   activeSection is passed down to Navbar as the "active" prop.
 *   Navbar uses it to highlight the corresponding nav link.
 *
 *   This is one-way data flow (parent owns state, child reads it):
 *   App (owns activeSection) → Navbar (reads active prop)
 *   Identical pattern to passing state down in React Native.
 *
 * export default:
 *   Makes this component importable in src/index.js.
 *   React Native equivalent: export default function App() {}
 *   Exact same syntax.
 */
export default function App() {
  // activeSection: the id of the section currently visible.
  // Default 'hero' so the first nav link is highlighted on load.
  const [activeSection, setActiveSection] = useState('hero');

  // Start scroll-reveal system (§5)
  useScrollReveal();

  // Watch sections for active nav tracking
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // entry.target.id = the id attribute of the section
            // e.g. 'hero', 'about', 'skills', 'experience', 'projects', 'contact'
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 } // section must be 35% visible to count as "active"
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect(); // cleanup on unmount
  }, []); // [] = run once on mount

  return (
    <>
      {/*
        React Fragments (<> </>) let you return multiple elements
        without wrapping them in an extra <div>.
        React Native equivalent: <> or <React.Fragment>
        Identical syntax and purpose.
      */}

      <GlobalStyle />       {/* Injects CSS into <head> — renders nothing visible */}

      {/*
        active={activeSection}: passes state DOWN to Navbar as a prop.
        Navbar reads it to highlight the correct link.
        This is React's one-way data flow pattern.
        React Native equivalent: <Navbar active={activeSection} />
        Identical syntax.
      */}
      <Navbar active={activeSection} />

      {/*
        <main>: semantic HTML for the primary content area.
        Screen readers and search engines use this for navigation.
        React Native equivalent: plain <View> (semantics don't exist in RN).
      */}
      <main>
        <Hero />
        <Ticker />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <AwardsBar />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
