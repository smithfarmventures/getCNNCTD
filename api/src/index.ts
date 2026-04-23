import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth';
import profileRouter from './routes/profile';
import discoverRouter from './routes/discover';
import swipeRouter from './routes/swipe';
import matchesRouter from './routes/matches';
import messagesRouter from './routes/messages';
import waitlistRouter from './routes/waitlist';

const app = express();

// ── Middleware ──────────────────────────────────────────────
// CORS: restrict to the configured origin(s) in production; open in dev.
// CORS_ORIGIN can be a single origin or a comma-separated list.
const corsOriginEnv = process.env.CORS_ORIGIN?.trim();
const allowedOrigins = corsOriginEnv
  ? corsOriginEnv.split(',').map((o) => o.trim()).filter(Boolean)
  : null;
app.use(
  cors({
    origin: allowedOrigins ?? true, // true = reflect request origin (dev convenience)
    credentials: true,
  })
);
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/discover', discoverRouter);
app.use('/swipe', swipeRouter);
app.use('/matches', matchesRouter);

// Messages sub-resource: /matches/:id/messages
// mergeParams: true in the messages router picks up the :id param
app.use('/matches/:id/messages', messagesRouter);

app.use('/waitlist', waitlistRouter);

// ── Health check ────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 catch-all ───────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start server ────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CNNCTD API running on port ${PORT}`);
});

export default app;
