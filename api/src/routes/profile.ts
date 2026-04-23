import { Router, Response } from 'express';
import { pool } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /profile — fetch the current user's profile
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: userId, role } = req.user!;

  try {
    let result;

    if (role === 'investor') {
      result = await pool.query(
        `SELECT
           u.id AS user_id, u.email, u.role, u.created_at AS user_created_at,
           ip.*
         FROM users u
         LEFT JOIN investor_profiles ip ON ip.user_id = u.id
         WHERE u.id = $1`,
        [userId]
      );
    } else {
      result = await pool.query(
        `SELECT
           u.id AS user_id, u.email, u.role, u.created_at AS user_created_at,
           fp.*
         FROM users u
         LEFT JOIN founder_profiles fp ON fp.user_id = u.id
         WHERE u.id = $1`,
        [userId]
      );
    }

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /profile — upsert profile fields
router.put('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: userId, role } = req.user!;
  const fields = req.body;

  if (!fields || Object.keys(fields).length === 0) {
    res.status(400).json({ error: 'No fields provided to update' });
    return;
  }

  try {
    let result;

    if (role === 'investor') {
      const allowedFields = [
        'firm_name', 'year_founded', 'hq_location', 'fund_size',
        'check_size_min', 'check_size_max', 'stage_focus', 'industry_focus',
        'investment_pros', 'thesis', 'photo_url',
      ];

      const updateFields = Object.keys(fields).filter(k => allowedFields.includes(k));
      if (updateFields.length === 0) {
        res.status(400).json({ error: 'No valid investor profile fields provided' });
        return;
      }

      const setClauses = updateFields.map((field, i) => `${field} = $${i + 2}`).join(', ');
      const values = [userId, ...updateFields.map(f => fields[f])];

      result = await pool.query(
        `INSERT INTO investor_profiles (user_id, ${updateFields.join(', ')}, updated_at)
         VALUES ($1, ${updateFields.map((_, i) => `$${i + 2}`).join(', ')}, NOW())
         ON CONFLICT (user_id) DO UPDATE
         SET ${setClauses}, updated_at = NOW()
         RETURNING *`,
        values
      );
    } else {
      const allowedFields = [
        'company_name', 'year_founded', 'ceo_name', 'hq_location', 'industry',
        'stage', 'employee_count', 'capital_raised_to_date', 'round_target',
        'one_liner', 'overview', 'revenue_ltm', 'revenue_growth_yoy',
        'gross_margin', 'gross_churn', 'burn_multiple', 'maus', 'logo_url',
      ];

      const updateFields = Object.keys(fields).filter(k => allowedFields.includes(k));
      if (updateFields.length === 0) {
        res.status(400).json({ error: 'No valid founder profile fields provided' });
        return;
      }

      const setClauses = updateFields.map((field, i) => `${field} = $${i + 2}`).join(', ');
      const values = [userId, ...updateFields.map(f => fields[f])];

      result = await pool.query(
        `INSERT INTO founder_profiles (user_id, ${updateFields.join(', ')}, updated_at)
         VALUES ($1, ${updateFields.map((_, i) => `$${i + 2}`).join(', ')}, NOW())
         ON CONFLICT (user_id) DO UPDATE
         SET ${setClauses}, updated_at = NOW()
         RETURNING *`,
        values
      );
    }

    res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
