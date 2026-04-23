import { Router, Response } from 'express';
import { pool } from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router({ mergeParams: true });

// Helper: verify the current user is a participant in the given match
async function verifyMatchParticipant(matchId: string, userId: string): Promise<boolean> {
  const result = await pool.query(
    `SELECT id FROM matches WHERE id = $1 AND (investor_id = $2 OR founder_id = $2)`,
    [matchId, userId]
  );
  return result.rows.length > 0;
}

// GET /matches/:id/messages — list messages in a match, oldest first
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: userId } = req.user!;
  const { id: matchId } = req.params;

  try {
    const isParticipant = await verifyMatchParticipant(matchId, userId);
    if (!isParticipant) {
      res.status(403).json({ error: 'You are not a participant in this match' });
      return;
    }

    const result = await pool.query(
      `SELECT
         msg.id,
         msg.match_id,
         msg.sender_id,
         msg.content,
         msg.created_at,
         u.email AS sender_email,
         u.role AS sender_role
       FROM messages msg
       JOIN users u ON u.id = msg.sender_id
       WHERE msg.match_id = $1
       ORDER BY msg.created_at ASC`,
      [matchId]
    );

    res.json({ messages: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /matches/:id/messages — send a message in a match
router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: userId } = req.user!;
  const { id: matchId } = req.params;
  const { content } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    res.status(400).json({ error: 'content is required and cannot be empty' });
    return;
  }

  if (content.length > 5000) {
    res.status(400).json({ error: 'Message content cannot exceed 5000 characters' });
    return;
  }

  try {
    const isParticipant = await verifyMatchParticipant(matchId, userId);
    if (!isParticipant) {
      res.status(403).json({ error: 'You are not a participant in this match' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO messages (match_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [matchId, userId, content.trim()]
    );

    const message = result.rows[0];

    // Update match status to in_conversation if it is still 'new'
    await pool.query(
      `UPDATE matches SET status = 'in_conversation'
       WHERE id = $1 AND status = 'new'`,
      [matchId]
    );

    res.status(201).json({ message });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
