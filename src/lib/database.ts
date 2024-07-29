import sqlite3 from 'sqlite3';
const { Database, verbose } = sqlite3;

verbose();
const db = new Database('sudoku.db'); // 使用文件数据库

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS sudoku_puzzles (id INTEGER PRIMARY KEY AUTOINCREMENT, puzzle TEXT NOT NULL)", (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table sudoku_puzzles created or already exists.');
        }
    });
    db.run("CREATE TABLE IF NOT EXISTS sudoku_steps (id INTEGER PRIMARY KEY AUTOINCREMENT, game_id INTEGER, step_number INTEGER, grid_state TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Error creating steps table:', err);
        } else {
            console.log('Table sudoku_steps created or already exists.');
        }
    });
    db.run("CREATE TABLE IF NOT EXISTS sudoku_results (id INTEGER PRIMARY KEY AUTOINCREMENT, game_id INTEGER, grid_state TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Error creating results table:', err);
        } else {
            console.log('Table sudoku_results created or already exists.');
        }
    });
});

export { db };
