"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const database_1 = require("../../../lib/database");
function handler(req, res) {
    const { id } = req.query;
    if (typeof id === 'string') {
        database_1.db.get("SELECT puzzle FROM sudoku_puzzles WHERE id = ?", [id], (err, row) => {
            if (err || !row) {
                res.status(404).send('Puzzle not found');
            }
            else {
                res.json({ puzzle: JSON.parse(row.puzzle) });
            }
        });
    }
    else {
        res.status(400).send('Invalid id');
    }
}
