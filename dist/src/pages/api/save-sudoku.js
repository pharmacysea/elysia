"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const database_1 = require("../../lib/database");
function handler(req, res) {
    if (req.method === 'POST') {
        const { puzzle } = req.body;
        // 确保 puzzle 数据有效
        if (!Array.isArray(puzzle) || puzzle.length !== 81) {
            console.error('Invalid puzzle data');
            res.status(400).send('Invalid puzzle data');
            return;
        }
        console.log('Received puzzle:', puzzle); // 添加日志
        // 保存数独谜题到数据库
        const stmt = database_1.db.prepare("INSERT INTO sudoku_puzzles (puzzle) VALUES (?)");
        stmt.run(JSON.stringify(puzzle), function (err) {
            if (err) {
                console.error('Error saving puzzle:', err);
                res.status(500).send('Error saving puzzle');
            }
            else {
                console.log('Puzzle saved with ID:', this.lastID); // 添加日志
                res.json({ id: this.lastID });
            }
        });
        stmt.finalize();
    }
    else {
        res.status(405).send('Method Not Allowed');
    }
}
