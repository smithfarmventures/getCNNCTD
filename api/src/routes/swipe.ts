import { Router, Response } from 'express';
import { pool } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const DAILY_SWIPE_LIMIT = 20;

// POST /swipe — record a swipe, detect mutual likes, create match if needed
router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: swiperId, role } = req.user!;
  const { swiped_id, direction } = req.body;

  if (!swiped_id || !direction) {
    res.status(400).json({ error: 'swiped_id and direction are required' });
    return;
  }

  if (!['like', 'pass'].includes(direction)) {
    res.status(400).json({ error: 'direction must be "like" or "pass"' });
    return;
  }

  if (swiped_id === swiperId) {
    res.status(400).json({ error: 'Cannot swipe on yourself' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check daily swipe count
    const countResult = await client.query(
      `SELECT COUNT(*) AS count
       FROM swipes
       WHERE swiper_id = $1
         AND created_at >= CURRENT_DATE`,
      [swiperId]
    );
    const dailyCount = parseInt(countResult.rows[0].count, 10);

    if (dailyCount >= DAILY_SWIPE_LIMIT) {
      await client.query('ROLLBACK');
      res.status(429).json({
        error: `Daily swipe limit of ${DAILY_SWIPE_LIMIT} reached. Come back tomorrow!`,
      });
      return;
    }

    // Verify the swiped user exists and is the opposite role
    const swipedUserResult = await client.query(
      `SELECT id, role FROM users WHERE id = $1`,
      [swiped_id]
    );

    if (swipedUserResult.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const swipedUser = swipedUserResult.rows[0];
    if (swipedUser.role === role) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'Can only swipe on users with the opposite role' });
      return;
    }

    // Insert swipe
    try {
      await client.query(
        `INSERT INTO swipes (swiper_id, swiped_id, direction) VALUES ($1, $2, $3)`,
        [swiperId, swiped_id, direction]
      );
    } catch (err: unknown) {
      const pgErr = err as { code?: string };
      if (pgErr.code === '23505') {
        await client.query('ROLLBACK');
        res.status(409).json({ error: 'You have already swiped on this user' });
        return;
      }
      throw err;
    }

    // If pass, we're done
    if (direction === 'pass') {
      await client.query('COMMIT');
      res.json({ matched: false });
      return;
    }

    // direction === 'like': check for reverse like (mutual match)
    const reverseResult = await client.query(
      `SELECT id FROM swipes
       WHERE swiper_id = $1 AND swiped_id = $2 AND direction = 'like'`,
      [swiped_id, swiperId]
    );

    if (reverseResult.rows.length === 0) {
      await client.query('COMMIT');
      res.json({ matched: false });
      return;
    }

    // Mutual like — create a match
    const investorId = role === 'investor' ? swiperId : swiped_id;
    const founderId = role === 'founder' ? swiperId : swiped_id;

    const matchResult = await client.query(
      `INSERT INTO matches (investor_id, founder_id, status)
       VALUES ($1, $2, 'new')
       RETURNING id`,
      [investorId, founderId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      matched: true,
      match_id: matchResult.rows[0].id,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Swipe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

export default router;
