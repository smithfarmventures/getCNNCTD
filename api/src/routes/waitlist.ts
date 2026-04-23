import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// POST /waitlist — add email to waitlist
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { email, name, role, company } = req.body;

  if (!email) {
    res.status(400).json({ error: 'email is required' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  if (role && !['investor', 'founder'].includes(role)) {
    res.status(400).json({ error: 'role must be "investor" or "founder"' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO waitlist (email, name, role, company)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, company, created_at`,
      [email.toLowerCase().trim(), name || null, role || null, company || null]
    );

    res.status(201).json({
      message: 'You have been added to the waitlist!',
      entry: result.rows[0],
    });
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === '23505') {
      res.status(409).json({ error: 'This email is already on the waitlist' });
      return;
    }
    console.error('Waitlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
