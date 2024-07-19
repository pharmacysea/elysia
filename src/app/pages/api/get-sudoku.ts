import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';

interface SudokuRow {
    puzzle: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id === 'string') {
        db.get("SELECT puzzle FROM sudoku_puzzles WHERE id = ?", [id], (err, row: SudokuRow | undefined) => {
            if (err || !row) {
                res.status(404).send('Puzzle not found');
            } else {
                res.json({ puzzle: JSON.parse(row.puzzle) });
            }
        });
    } else {
        res.status(400).send('Invalid id');
    }
}
