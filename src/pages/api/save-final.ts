import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { puzzle, gameId } = req.body;

        if (!puzzle || !Array.isArray(puzzle) || typeof gameId !== 'string') {
            console.error('Invalid final result data:', req.body);
            res.status(400).send('Invalid final result data');
            return;
        }

        const stmt = db.prepare("INSERT INTO sudoku_results (game_id, grid_state) VALUES (?, ?)");
        stmt.run([gameId, JSON.stringify(puzzle)], function (err) {
            if (err) {
                console.error('Error saving final result:', err);
                res.status(500).send('Error saving final result');
            } else {
                res.status(200).send('Final result saved');
            }
        });
        stmt.finalize();
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
