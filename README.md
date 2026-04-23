# CNNCTD

A two-sided VC/founder matching platform. Investors swipe on startups. Founders swipe on investors. Mutual likes create matches and unlock messaging.

## Monorepo Structure

```
cnnctd/
├── api/          Express + TypeScript REST API (deployable to Railway)
├── mobile/       React Native / Expo app (iOS + Android)
├── web/          Next.js 14 marketing + waitlist site
├── schema.sql    Full Postgres schema
├── seeds.sql     Seed data: 5 investors + 5 founders
└── README.md
```

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or a Railway Postgres plugin)
- npm or yarn

## Database Setup

```bash
# Create your database, then run:
psql $DATABASE_URL -f schema.sql
psql $DATABASE_URL -f seeds.sql
```

## API (`/api`)

### Setup

```bash
cd api
cp .env.example .env        # fill in DATABASE_URL and JWT_SECRET
npm install
npm run dev                 # starts ts-node-dev on port 3000
```

### Environment Variables

| Variable       | Description                                  |
|----------------|----------------------------------------------|
| `DATABASE_URL` | Postgres connection string                   |
| `JWT_SECRET`   | Long random secret for signing JWTs          |
| `PORT`         | Server port (default: 3000)                  |

### Endpoints

| Method | Path                        | Auth | Description                                  |
|--------|-----------------------------|------|----------------------------------------------|
| GET    | /health                     | No   | Health check                                 |
| POST   | /auth/signup                | No   | Register (email, password, role)             |
| POST   | /auth/login                 | No   | Login, receive JWT                           |
| GET    | /profile                    | Yes  | Get own profile                              |
| PUT    | /profile                    | Yes  | Upsert own profile fields                    |
| GET    | /discover                   | Yes  | Get 10 unswiped profiles of opposite role    |
| POST   | /swipe                      | Yes  | Swipe like/pass; returns match if mutual     |
| GET    | /matches                    | Yes  | List all matches with counterparty preview   |
| PATCH  | /matches/:id                | Yes  | Update match status                          |
| GET    | /matches/:id/messages       | Yes  | Get messages in a match                      |
| POST   | /matches/:id/messages       | Yes  | Send a message in a match                    |
| POST   | /waitlist                   | No   | Join the waitlist                            |

### Business Rules

- **Swipe limit:** 20 swipes per user per calendar day (429 if exceeded)
- **Duplicate swipe:** returns 409
- **Match creation:** triggered automatically on mutual like
- **Message auto-status:** first message in a match sets status to `in_conversation`
- **JWT expiry:** 30 days

### Deploy to Railway

```bash
# From /api — Railway reads railway.toml automatically
railway up
```

## Mobile (`/mobile`)

React Native with Expo Router. Scaffold only — full implementation in a subsequent step.

```bash
cd mobile
npm install
npm run ios       # or npm run android
```

## Web (`/web`)

Next.js 14 + Tailwind CSS. Scaffold only — full implementation in a subsequent step.

```bash
cd web
cp .env.local.example .env.local    # fill in RAILWAY_API_URL
npm install
npm run dev
```

## Seed Users

All seed users share the password `Password123!`.

| Email                             | Role     | Company / Firm        |
|-----------------------------------|----------|-----------------------|
| sarah.chen@apexventures.com       | investor | Apex Ventures         |
| marcus.riley@northstarcapital.vc  | investor | NorthStar Capital     |
| priya.nair@redwoodgrowth.com      | investor | Redwood Growth Partners |
| james.okafor@titanfund.io         | investor | Titan Fund            |
| elena.vasquez@harborpeak.vc       | investor | Harbor Peak Ventures  |
| alex.morgan@vaultlayer.io         | founder  | VaultLayer            |
| dana.kim@flowcastai.com           | founder  | FlowCast AI           |
| omar.hassan@carbonledger.co       | founder  | CarbonLedger          |
| tara.singh@loopmarket.com         | founder  | LoopMarket            |
| ben.lautner@medsynchealth.com     | founder  | MedSync Health        |
