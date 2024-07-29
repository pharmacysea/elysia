import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { puzzle, stepNumber, gameId } = req.body;

        if (!puzzle || !Array.isArray(puzzle) || typeof stepNumber !== 'number' || typeof gameId !== 'string') {
            console.error('Invalid step data:', req.body);
            res.status(400).send('Invalid step data');
            return;
        }

        const stmt = db.prepare("INSERT INTO sudoku_steps (game_id, step_number, grid_state) VALUES (?, ?, ?)");
        stmt.run([gameId, stepNumber, JSON.stringify(puzzle)], function (err) {
            if (err) {
                console.error('Error saving step:', err);
                res.status(500).send('Error saving step');
            } else {
                res.status(200).send('Step saved');
            }
        });
        stmt.finalize();
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
