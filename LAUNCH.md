# CNNCTD Launch Checklist

Landing page + signup flow. Mobile app is not part of this launch.

## Flow this ships

Visitor lands on `/` → clicks "Get CNNCTD" (Hero or Nav) → scrolls to JoinSection role picker → clicks "I'm a founder" or "I'm an investor" → lands on `/waitlist?role=...` with role pre-selected → submits → `/api/waitlist` (Next.js) → Railway API `/waitlist` → Neon Postgres `waitlist` table.

## Status snapshot (as of the last session)

**Already done for you:**
- [x] Code fixes (see "Files that were changed" below) — all in the working tree, not yet pushed.
- [x] Neon DB verified. `waitlist` table exists with the right schema (`id` uuid PK, `email` text NOT NULL + unique, `name`/`role`/`company` nullable text, `created_at` timestamptz default `now()`).
- [x] Pooled `DATABASE_URL` captured in `.launch-secrets.local`.
- [x] Fresh `JWT_SECRET` generated and saved in `.launch-secrets.local`.
- [x] Vercel project `get-cnnctd` (team: raj-capital) pre-configured: **Framework = Next.js**, **Root Directory = web**. So the first real deploy will build correctly.

**What's left (all blocked on getting the repo pushed to GitHub):**
1. Push to GitHub — auth with a Personal Access Token (see step 1 below).
2. Deploy API to Railway (step 2).
3. Paste `RAILWAY_API_URL` into Vercel env vars. Vercel will auto-redeploy (step 3).
4. Paste the Vercel URL into Railway's `CORS_ORIGIN` (step 4).
5. Smoke test (step 5).

## One-time setup (do this in order)

### 1. Put the repo on GitHub

You'll need a Personal Access Token — GitHub rejected the password-auth attempt last session. Generate one at **github.com → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)**. Give it the `repo` scope. Copy it (it only shows once).

Then in terminal:

```bash
cd "/Users/cohen_andrew/Documents/Claude Projects/getCNNCTD"
git status                 # confirm the working tree is clean or has only intended changes
git log --oneline -5       # see what's committed
git push -u origin main    # when prompted for password, paste the PAT (not your GitHub password)
```

If the push fails with "src refspec main does not match any", the branch is unborn — run `git add -A && git commit -m "Initial commit — launch-ready"` first, then retry the push. If the push is rejected because of a divergent history from a prior attempt, `git push -u origin main --force` is safe here (no one else is pushing to this repo).

`.gitignore` already keeps `.env`, `.env.local`, `.launch-secrets.local`, and `node_modules/` out of the repo. Before pushing, eyeball `git status` and `git log --stat` to confirm no secrets sneak in.

### 2. Deploy the API to Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo → pick `smithfarmventures/getCNNCTD`.
2. Set **Root Directory** to `api` (Service Settings → Source).
3. Add the following environment variables (Service → Variables). The values are in `.launch-secrets.local`:
   - `DATABASE_URL` — the pooled Neon connection string
   - `JWT_SECRET` — the generated secret
   - `CORS_ORIGIN` — leave blank for now; you'll fill it in after step 3
4. Deploy. Wait for the build to finish. Hit `https://<your-railway-url>/health` — should return `{"status":"ok",...}`.
5. Note the public URL (e.g. `https://cnnctd-api-production.up.railway.app`) — you need it next.

### 3. Wire Vercel to the API

The Vercel project `get-cnnctd` is already linked to this GitHub repo and pre-configured (Framework=Next.js, Root Directory=web). A push to `main` will auto-trigger a deploy. Before that deploy can talk to the API, set the env var:

1. Go to **vercel.com → raj-capital → get-cnnctd → Settings → Environment Variables**.
2. Add `RAILWAY_API_URL` = the Railway URL from step 2 (no trailing slash). Apply to Production.
3. If a deploy already ran from the GitHub push, hit **Deployments → ⋯ → Redeploy** on the latest one so it picks up the new env var. Vercel will assign a URL (default `get-cnnctd.vercel.app`).

### 4. Close the CORS loop

1. Copy your Vercel URL (e.g. `https://get-cnnctd.vercel.app`).
2. Back in Railway → Variables → set `CORS_ORIGIN` to that URL. If you add a custom domain later, switch to a comma-separated list: `https://getcnnctd.com,https://get-cnnctd.vercel.app`.
3. Railway will restart the API automatically.

### 5. Smoke test (do this before sharing the link)

1. Open the Vercel URL.
2. Click "Get CNNCTD" in the hero — confirm it scrolls to the role picker.
3. Click "I'm a founder" — confirm it loads `/waitlist?role=founder` and the Founder button is pre-selected.
4. Submit the form with a throwaway email. Confirm the success state renders.
5. In the Neon console, run `SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 5;` — confirm the row is there.
6. If anything fails, check the Railway logs and the browser Network tab.

## Files that were changed to make this work

- `web/components/JoinSection.tsx` — CTAs were `href="#"` (dead). Now point to `/waitlist?role=founder|investor`.
- `web/app/waitlist/page.tsx` — new. The WaitlistForm component existed but was never rendered anywhere.
- `web/tailwind.config.ts` — added dark-theme color tokens (`bg-base`, `brand-mid`, `success`, etc.) the form uses but that weren't defined.
- `web/app/globals.css` — added the `.text-gradient-brand` utility.
- `api/src/index.ts` — CORS now reads `CORS_ORIGIN` instead of allowing all origins.
- `.gitignore` — new. Protects `.env`, secrets, `node_modules`, build output.
- `web/.env.production.example`, `api/.env.production.example` — document the env vars needed in each dashboard.
- `.launch-secrets.local` — contains the pooled `DATABASE_URL` and a freshly-generated `JWT_SECRET` (gitignored; delete after pasting into Railway).

## Things deliberately not done

- **Email confirmation to signups.** The API just writes to the DB. If you want a "thanks for signing up" email, that's a Resend/Postmark integration — tell me and I'll wire it up.
- **Custom domain.** When your domain is ready, add it in Vercel and update `CORS_ORIGIN` in Railway.
- **Mobile app.** Scaffold only; not launch-critical.
- **Rate limiting on `/waitlist`.** Not needed for day-one traffic, but add it before anything public and high-volume.

## Rollback

If something goes wrong mid-launch: in Vercel, Deployments → previous deployment → "Promote to Production." Same in Railway (Deployments → redeploy a prior build). Both take ~30 seconds.
