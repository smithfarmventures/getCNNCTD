# CNNCTD — MVP Build Prompt for Claude Code

> Drop this file into your project root and tell Claude Code: "Read CNNCTD_build_prompt.md and let's start building."

---

## WHAT WE'RE BUILDING

CNNCTD is a mobile-first, two-sided marketplace connecting venture capital
investors with founders. Think Tinder swipe UX meets VC sourcing — replacing
stale databases like PitchBook and Crunchbase with real-time, profile-driven
matching.

**The core loop:** Founders and investors create profiles → the app surfaces
relevant matches → both sides swipe → mutual interest creates a match →
they message and connect.

---

## TECH STACK

| Layer | Tool | Notes |
|---|---|---|
| Mobile | React Native (Expo) | Cross-platform iOS + Android |
| Web | Next.js 14 (App Router) + Tailwind CSS | Landing/waitlist page |
| Language | TypeScript throughout | Strict mode |
| State | Zustand | Mobile app state |
| Database | PostgreSQL on Railway | Primary data store |
| Backend API | Node.js + Express on Railway | REST API consumed by both mobile + web |
| Auth | JWT (issued by Railway API) | Stored securely via Expo SecureStore |
| Web Deploy | Vercel | Auto-deploy from main branch |
| API Deploy | Railway | Auto-deploy from main branch |

**Do not use Supabase, Firebase, or any other BaaS.** All backend logic
lives in the Railway Express API. All data lives in Railway PostgreSQL.

---

## BRAND / DESIGN SYSTEM

```
Primary dark:    #1A4A45
Primary mid:     #2D6B63
Primary light:   #3D8B7A
Accent blue:     #4DA6FF
Background:      #1C2333
Surface:         #243044
Text primary:    #FFFFFF
Text secondary:  #B0B8C4
Success/match:   #00C48C
Danger/pass:     #FF4D6D
```

**Typography:** Inter or similar clean sans-serif. Bold and heavy weights
for headings. The brand feels like a premium fintech tool — dark, sharp,
professional. Not consumer-casual.

**Logo:** "CNN" stacked above "CTD" in bold white, with a stylized bridge
icon (two diagonal parallel lines with vertical crossbars) between them.

**Tagline:** *Get CNNCTD — Stay Connected*

---

## USER TYPES

1. **INVESTORS** — VCs, PE firms, emerging managers, analysts, associates
2. **FOUNDERS** — startup CEOs/founders actively raising capital

Both types have distinct onboarding flows, profile schemas, and views.

---

## DATABASE SCHEMA (Railway PostgreSQL)

Scaffold these tables in a `schema.sql` file at the project root.
Include a `seeds.sql` with 5 dummy investor profiles and 5 dummy founder
profiles so the swipe UI is testable immediately.

```sql
-- Users / Auth
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('investor', 'founder')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investor Profiles
CREATE TABLE investor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  firm_name TEXT,
  year_founded INT,
  hq_location TEXT,
  fund_size TEXT,
  check_size_min INT,
  check_size_max INT,
  stage_focus TEXT[], -- e.g. ['pre-seed','seed','series-a']
  industry_focus TEXT[],
  investment_pros INT,
  thesis TEXT, -- 280 char max
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Founder / Company Profiles
CREATE TABLE founder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  year_founded INT,
  ceo_name TEXT,
  hq_location TEXT,
  industry TEXT,
  stage TEXT,
  employee_count TEXT, -- e.g. '1-10', '11-50'
  capital_raised_to_date BIGINT,
  round_target BIGINT,
  one_liner TEXT, -- 140 char max
  overview TEXT,  -- 500 char max
  -- Optional KPIs (more data = better match quality)
  revenue_ltm BIGINT,
  revenue_growth_yoy NUMERIC,
  gross_margin NUMERIC,
  gross_churn NUMERIC,
  burn_multiple NUMERIC,
  maus INT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Swipes
CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID REFERENCES users(id),
  swiped_id UUID REFERENCES users(id),
  direction TEXT NOT NULL CHECK (direction IN ('like', 'pass')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_id)
);

-- Matches (created when both sides like each other)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES users(id),
  founder_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'new' CHECK (status IN ('new','in_conversation','meeting_scheduled','passed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waitlist (web landing page)
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('investor', 'founder')),
  company TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## BACKEND API (Railway — Node/Express)

### File structure

```
api/
├── src/
│   ├── index.ts           # Express app entry
│   ├── db.ts              # pg Pool setup using DATABASE_URL from env
│   ├── middleware/
│   │   └── auth.ts        # JWT verify middleware
│   └── routes/
│       ├── auth.ts        # POST /auth/signup, POST /auth/login
│       ├── profile.ts     # GET/PUT /profile (own profile)
│       ├── discover.ts    # GET /discover (paginated cards to show)
│       ├── swipe.ts       # POST /swipe
│       ├── matches.ts     # GET /matches
│       ├── messages.ts    # GET/POST /matches/:id/messages
│       └── waitlist.ts    # POST /waitlist
├── schema.sql
├── seeds.sql
├── package.json
└── railway.toml
```

### Key API endpoints

```
POST   /auth/signup         { email, password, role }
POST   /auth/login          { email, password } → { token, user }

GET    /profile             → own profile (investor or founder based on role)
PUT    /profile             update own profile fields

GET    /discover            → array of cards (opposite role, not yet swiped)
                              Query params: limit=10, offset=0
POST   /swipe               { swiped_id, direction: 'like'|'pass' }
                              Auto-creates match if mutual

GET    /matches             → array of matches with profile previews
PATCH  /matches/:id         { status } — update match status

GET    /matches/:id/messages
POST   /matches/:id/messages { content }

POST   /waitlist            { email, name, role, company }
```

### Swipe logic (in POST /swipe handler)

```
1. Insert into swipes table
2. If direction === 'like':
   a. Query swipes for the reverse (swiped_id liked swiper_id)
   b. If reverse like exists → INSERT into matches → return { matched: true, match_id }
   c. Else → return { matched: false }
3. Enforce daily swipe limit: count swipes by user today, reject if >= 20 (free tier)
```

### Auth

- Use `bcrypt` for password hashing
- Use `jsonwebtoken` for JWT (set expiry to 30 days for MVP)
- Pass token as `Authorization: Bearer <token>` header
- Protect all routes except `/auth/*` and `POST /waitlist`

### Environment variables (Railway)

```
DATABASE_URL=postgresql://...   (auto-injected by Railway Postgres plugin)
JWT_SECRET=your-secret-here
PORT=3000
```

---

## MOBILE APP (Expo React Native)

### File structure

```
mobile/
├── app/
│   ├── (auth)/
│   │   ├── index.tsx          # Splash screen
│   │   ├── login.tsx
│   │   └── signup.tsx         # Includes role selection
│   ├── (onboarding)/
│   │   ├── investor.tsx       # Multi-step investor profile form
│   │   └── founder.tsx        # Multi-step founder profile form
│   └── (main)/
│       ├── _layout.tsx        # Bottom tab navigator
│       ├── discover.tsx       # Swipe card stack
│       ├── pipeline.tsx       # Matches list
│       ├── messages/
│       │   ├── index.tsx      # Message threads list
│       │   └── [matchId].tsx  # Individual chat
│       └── profile.tsx        # Own profile + settings
├── components/
│   ├── SwipeCard.tsx          # Individual card UI
│   ├── CardStack.tsx          # Gesture + animation logic
│   ├── TagBadge.tsx           # Pill tag for stage/industry
│   ├── KPIChart.tsx           # Simple bar chart for founder KPIs
│   └── MatchBanner.tsx        # "You've Been CNNCTD!" overlay
├── store/
│   ├── authStore.ts           # user, token, login/logout actions
│   └── discoverStore.ts       # card queue, swipe actions
├── lib/
│   ├── api.ts                 # Axios instance pointing to Railway API
│   └── storage.ts             # Expo SecureStore wrappers for token
├── constants/
│   ├── colors.ts              # Brand color tokens
│   └── types.ts               # Shared TypeScript interfaces
└── app.json
```

### Swipe card UI

Use `react-native-gesture-handler` + `react-native-reanimated` for swipe
gestures. Build a `CardStack` component that:

- Renders the top 3 cards (top card full opacity, cards behind scaled down)
- Tracks pan gesture on the top card
- On release: if x-offset > threshold → like (animate off right, green tint);
  if x-offset < -threshold → pass (animate off left, red tint)
- Shows like/pass icon overlays that fade in as the user drags
- Calls `POST /swipe` to API on card dismiss
- If API returns `matched: true` → show `MatchBanner` overlay with animation
- Fetches next batch of cards when queue drops below 3

### Discover card content

**Investor card:**
- Firm logo / photo (placeholder avatar if none)
- Firm name (bold, large)
- Thesis (truncated to 2 lines)
- Tag row: stage badges + industry badges
- Check size range
- HQ location

**Founder card:**
- Company logo / photo
- Company name + one-liner
- Tag row: stage + industry
- Round target (e.g., "Raising $2M Seed")
- One KPI teaser if available (e.g., "$1.2M ARR")
- Employee count badge

### Onboarding flows

Both onboarding flows should be multi-step (one topic per screen, progress
bar at top). Save to API on final submission. Skip button on optional fields.

After onboarding → navigate to main tab navigator (Discover tab).

### Swipe limits

Track daily swipe count in `discoverStore`. Show a "You've used your daily
swipes" empty state with a prompt to upgrade (no payment integration in MVP —
just show the message).

---

## WEB LANDING PAGE (Next.js on Vercel)

### File structure

```
web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx             # Single long-scroll page
│   └── api/
│       └── waitlist/
│           └── route.ts     # POST → Railway API /waitlist
├── components/
│   ├── Hero.tsx
│   ├── Problem.tsx
│   ├── HowItWorks.tsx
│   ├── WhoItsFor.tsx
│   ├── WaitlistForm.tsx
│   └── Footer.tsx
├── public/
│   └── logo.svg             # CNNCTD logo placeholder
├── tailwind.config.ts       # Include brand colors
└── .env.local               # RAILWAY_API_URL
```

### Page sections

1. **Hero** — Full-screen dark background, CNNCTD logo centered, tagline
   "The Mobile-First Social Venture Platform", subheadline about replacing
   cold outreach with intelligent matching. Two CTAs: "I'm a Founder" /
   "I'm an Investor" — both anchor to waitlist form with role pre-filled.

2. **Problem** — "The World Has Changed… But Venture Capital Has Not"
   Three pain points: (1) VC sourcing is broken and relationship-gated,
   (2) Founders waste time on cold outreach that goes nowhere,
   (3) Emerging managers can't compete with brand-name firms for deal flow.

3. **How It Works** — Three steps with mobile mockup illustrations:
   **JOIN** (create your profile) → **MEET** (swipe on matched profiles)
   → **CNNCT** (mutual match unlocks chat + scheduling)

4. **Who It's For** — 2×2 grid: Investors / Founders / Employees /
   Venture Ecosystem — use the benefit copy from the deck.

5. **Waitlist Form** — Name, email, role (toggle: Founder / Investor),
   company name. Submit → POST to `/api/waitlist` → Railway API.
   Show success state after submission.

6. **Footer** — Logo, tagline, placeholder social icons.

### Environment variables (Vercel)

```
RAILWAY_API_URL=https://your-api.railway.app
```

---

## MONOREPO STRUCTURE

```
cnnctd/
├── api/          # Express backend (deploy to Railway)
├── mobile/       # Expo app
├── web/          # Next.js landing page (deploy to Vercel)
├── README.md
└── CNNCTD_build_prompt.md   # This file
```

Use a simple monorepo — no Turborepo or Nx needed for MVP. Each subfolder
has its own `package.json`.

---

## BUILD ORDER

Work in this sequence. Complete each step before moving to the next.
Ask before making assumptions on ambiguous product decisions.

```
Step 1  Scaffold monorepo structure + all three package.json files
Step 2  Set up Railway PostgreSQL — run schema.sql + seeds.sql
Step 3  Build Express API skeleton with db connection + health check
Step 4  Implement auth routes (signup/login) + JWT middleware
Step 5  Implement profile routes (GET/PUT investor + founder)
Step 6  Implement discover + swipe routes with match logic
Step 7  Implement messages routes
Step 8  Implement waitlist route
Step 9  Scaffold Expo app with navigation structure
Step 10 Build auth flow screens (splash, login, signup)
Step 11 Build onboarding flows (investor + founder)
Step 12 Build Discover screen with SwipeCard + CardStack (dummy data first)
Step 13 Wire Discover to live API
Step 14 Build Pipeline (matches list) screen
Step 15 Build Messages screens (list + chat)
Step 16 Build Profile screen
Step 17 Build Next.js landing page (all sections + waitlist form)
Step 18 Wire waitlist form to Railway API
Step 19 End-to-end test: signup → onboard → swipe → match → message
Step 20 Deploy: API to Railway, web to Vercel
```

---

## CONSTRAINTS & NOTES

- **No payment integration in MVP.** Swipe limits are enforced in code but
  there is no Stripe or paywall — just show an upgrade prompt message.
- **No push notifications in MVP.** Match notifications are in-app only
  (refetch on focus).
- **No file uploads in MVP.** Profile photos and logos are optional URL
  fields — users can paste a URL. Add upload later.
- **Free tier swipe limit: 20 per day.** Tracked server-side by counting
  today's swipes for the user in the swipes table.
- **Seed data required.** The app must be testable without real users.
  Include at least 5 investor profiles and 5 founder profiles in seeds.sql.
- **Commit in logical chunks** with clear commit messages after each
  completed step.
