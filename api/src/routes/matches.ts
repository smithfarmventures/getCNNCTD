import { Router, Response } from 'express';
import { pool } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /matches — return all matches for the current user with preview of the other party
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: userId, role } = req.user!;

  try {
    let result;

    if (role === 'investor') {
      result = await pool.query(
        `SELECT
           m.id AS match_id,
           m.status,
           m.created_at AS matched_at,
           u.id AS other_user_id,
           u.email AS other_email,
           fp.company_name,
           fp.ceo_name,
           fp.hq_location,
           fp.industry,
           fp.stage,
           fp.one_liner,
           fp.round_target,
           fp.logo_url
         FROM matches m
         JOIN users u ON u.id = m.founder_id
         LEFT JOIN founder_profiles fp ON fp.user_id = m.founder_id
         WHERE m.investor_id = $1
         ORDER BY m.created_at DESC`,
        [userId]
      );
    } else {
      result = await pool.query(
        `SELECT
           m.id AS match_id,
           m.status,
           m.created_at AS matched_at,
           u.id AS other_user_id,
           u.email AS other_email,
           ip.firm_name,
           ip.hq_location,
           ip.fund_size,
           ip.check_size_min,
           ip.check_size_max,
           ip.stage_focus,
           ip.industry_focus,
           ip.thesis,
           ip.photo_url
         FROM matches m
         JOIN users u ON u.id = m.investor_id
         LEFT JOIN investor_profiles ip ON ip.user_id = m.investor_id
         WHERE m.founder_id = $1
         ORDER BY m.created_at DESC`,
        [userId]
      );
    }

    res.json({ matches: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('Get matches error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /matches/:id — update match status
router.patch('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: userId } = req.user!;
  const { id: matchId } = req.params;
  const { status } = req.body;

  const validStatuses = ['new', 'in_conversation', 'meeting_scheduled', 'passed'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({
      error: `status must be one of: ${validStatuses.join(', ')}`,
    });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE matches
       SET status = $1
       WHERE id = $2 AND (investor_id = $3 OR founder_id = $3)
       RETURNING *`,
      [status, matchId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Match not found or you are not a participant' });
      return;
    }

    res.json({ match: result.rows[0] });
  } catch (err) {
    console.error('Update match error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
