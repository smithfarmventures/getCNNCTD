import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = Router();

// POST /auth/signup
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    res.status(400).json({ error: 'email, password, and role are required' });
    return;
  }

  if (!['investor', 'founder'].includes(role)) {
    res.status(400).json({ error: 'role must be "investor" or "founder"' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters' });
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, role, created_at`,
      [email.toLowerCase().trim(), passwordHash, role]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.status(201).json({ token, user });
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === '23505') {
      res.status(409).json({ error: 'An account with that email already exists' });
      return;
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT id, email, role, password_hash, created_at FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    const { password_hash: _omit, ...userWithoutPassword } = user;

    // Check whether this user already has a profile so the mobile app
    // knows whether to skip onboarding or go straight to Discover.
    const profileTable =
      user.role === 'investor' ? 'investor_profiles' : 'founder_profiles';
    const profileCheck = await pool.query(
      `SELECT id FROM ${profileTable} WHERE user_id = $1 LIMIT 1`,
      [user.id]
    );
    const has_profile = profileCheck.rows.length > 0;

    res.json({ token, user: userWithoutPassword, has_profile });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
