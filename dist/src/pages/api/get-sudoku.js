"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const database_1 = require("../../lib/database");
function handler(req, res) {
    const { id } = req.query;
    if (typeof id === 'string') {
        database_1.db.get("SELECT puzzle FROM sudoku_puzzles WHERE id = ?", [id], (err, row) => {
            if (err) {
                console.error('Error retrieving puzzle:', err); // 添加错误日志
                res.status(500).json({ error: 'Error retrieving puzzle' });
            }
            else if (!row) {
                console.warn('Puzzle not found for ID:', id); // 添加警告日志
                res.status(404).json({ error: 'Puzzle not found' });
            }
            else {
                console.log('Loaded puzzle from DB:', row.puzzle); // 添加日志
                res.status(200).json({ puzzle: JSON.parse(row.puzzle) });
            }
        });
    }
    else {
        console.warn('Invalid id:', id); // 添加警告日志
        res.status(400).json({ error: 'Invalid id' });
    }
}
