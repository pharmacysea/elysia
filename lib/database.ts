import sqlite3 from 'sqlite3';
const { Database, verbose } = sqlite3;

verbose();
const db = new Database(':memory:'); // 使用内存数据库，生产环境可以使用文件数据库

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS sudoku_puzzles (id INTEGER PRIMARY KEY AUTOINCREMENT, puzzle TEXT NOT NULL)");
});

export { db };
