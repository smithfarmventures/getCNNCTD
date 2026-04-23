import { Router, Response } from 'express';
import { pool } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /discover — return profiles of the opposite role, excluding already-swiped users
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: userId, role } = req.user!;

  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    let result;

    if (role === 'investor') {
      // Investor sees founder profiles
      result = await pool.query(
        `SELECT
           u.id AS user_id,
           u.email,
           u.role,
           fp.id AS profile_id,
           fp.company_name,
           fp.year_founded,
           fp.ceo_name,
           fp.hq_location,
           fp.industry,
           fp.stage,
           fp.employee_count,
           fp.capital_raised_to_date,
           fp.round_target,
           fp.one_liner,
           fp.overview,
           fp.revenue_ltm,
           fp.revenue_growth_yoy,
           fp.gross_margin,
           fp.gross_churn,
           fp.burn_multiple,
           fp.maus,
           fp.logo_url,
           fp.created_at,
           fp.updated_at
         FROM users u
         INNER JOIN founder_profiles fp ON fp.user_id = u.id
         WHERE u.role = 'founder'
           AND u.id NOT IN (
             SELECT swiped_id FROM swipes WHERE swiper_id = $1
           )
           AND u.id != $1
         ORDER BY fp.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
    } else {
      // Founder sees investor profiles
      result = await pool.query(
        `SELECT
           u.id AS user_id,
           u.email,
           u.role,
           ip.id AS profile_id,
           ip.firm_name,
           ip.year_founded,
           ip.hq_location,
           ip.fund_size,
           ip.check_size_min,
           ip.check_size_max,
           ip.stage_focus,
           ip.industry_focus,
           ip.investment_pros,
           ip.thesis,
           ip.photo_url,
           ip.created_at,
           ip.updated_at
         FROM users u
         INNER JOIN investor_profiles ip ON ip.user_id = u.id
         WHERE u.role = 'investor'
           AND u.id NOT IN (
             SELECT swiped_id FROM swipes WHERE swiper_id = $1
           )
           AND u.id != $1
         ORDER BY ip.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
    }

    res.json({
      profiles: result.rows,
      count: result.rows.length,
      offset,
      limit,
    });
  } catch (err) {
    console.error('Discover error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
