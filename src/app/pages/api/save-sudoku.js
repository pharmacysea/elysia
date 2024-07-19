// pages/api/save-sudoku.js
import { db } from '../../lib/database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { puzzle } = req.body;
        console.log('Received puzzle:', puzzle);
        const stmt = db.prepare("INSERT INTO sudoku_puzzles (puzzle) VALUES (?)");
        stmt.run(JSON.stringify(puzzle), function (err) {
            if (err) {
                console.error('Error saving puzzle:', err);
                res.status(500).send('Error saving puzzle');
            } else {
                console.log('Puzzle saved with ID:', this.lastID);
                res.json({ id: this.lastID });
            }
        });
        stmt.finalize();
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
