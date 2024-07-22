"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// src/lib/database.ts
const sqlite3_1 = __importDefault(require("sqlite3"));
const { Database, verbose } = sqlite3_1.default;
verbose();
const db = new Database(':memory:'); // 使用内存数据库，生产环境可以使用文件数据库
exports.db = db;
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS sudoku_puzzles (id INTEGER PRIMARY KEY AUTOINCREMENT, puzzle TEXT NOT NULL)", (err) => {
        if (err) {
            console.error('Error creating table:', err);
        }
        else {
            console.log('Table created or already exists.');
        }
    });
});
