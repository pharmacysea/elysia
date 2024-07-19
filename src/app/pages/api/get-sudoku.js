import { db } from '../../../lib/database';

export default function handler(req, res) {
    const { id } = req.query;
    db.get("SELECT puzzle FROM sudoku_puzzles WHERE id = ?", [id], (err, row) => {
        if (err || !row) {
            res.status(404).send('Puzzle not found');
        } else {
            res.json({ puzzle: JSON.parse(row.puzzle) });
        }
    });
}
