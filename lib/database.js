const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // 使用内存数据库，生产环境可以使用文件数据库

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS sudoku_puzzles (id INTEGER PRIMARY KEY AUTOINCREMENT, puzzle TEXT NOT NULL)");
});

module.exports = { db };
