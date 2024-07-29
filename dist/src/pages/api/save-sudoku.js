"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const database_1 = require("../../lib/database");
function handler(req, res) {
    if (req.method === 'POST') {
        const { puzzle, difficulty } = req.body;
        // 验证 puzzle参数
        if (!puzzle || !Array.isArray(puzzle)) {
            console.error('Invalid puzzle data:', puzzle);
            res.status(400).send('Invalid puzzle data');
            return;
        }
        // 记录生成的谜题
        console.log('Generated puzzle:', JSON.stringify(puzzle));
        // 保存数独谜题到数据库
        const stmt = database_1.db.prepare("INSERT INTO sudoku_puzzles (puzzle) VALUES (?)");
        stmt.run(JSON.stringify(puzzle), function (err) {
            if (err) {
                console.error('Error saving puzzle:', err);
                res.status(500).send('Error saving puzzle');
            }
            else {
                res.json({ id: this.lastID });
            }
        });
        stmt.finalize();
    }
    else {
        res.status(405).send('Method Not Allowed');
    }
}
