import express, { Request, Response } from 'express';
import { Database } from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 创建并初始化数据库
const db = new Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS sudoku_puzzles (id INTEGER PRIMARY KEY AUTOINCREMENT, puzzle TEXT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS sudoku_steps (id INTEGER PRIMARY KEY AUTOINCREMENT, game_id INTEGER, step_number INTEGER, grid_state TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
    db.run("CREATE TABLE IF NOT EXISTS sudoku_results (id INTEGER PRIMARY KEY AUTOINCREMENT, game_id INTEGER, grid_state TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
});


// 根路径处理程序
app.get('/', (req: Request, res: Response) => {
    res.send('欢迎来到往世乐土，还请输入相应的数独题目的ID哦.');
});

// API: 保存数独题目
app.post('/api/save-sudoku', (req: Request, res: Response) => {
    const { puzzle } = req.body;
    console.log('Received puzzle:', puzzle);
    const stmt = db.prepare("INSERT INTO sudoku_puzzles (puzzle) VALUES (?)");
    stmt.run(JSON.stringify(puzzle), function (err) {
        if (err) {
            console.error('Error saving puzzle:', err);
            res.status(500).send('Error saving puzzle');
        } else {
            console.log('Puzzle saved with ID:', this.lastID);
            res.json({ id: this.lastID }); // 返回生成的唯一ID
        }
    });
    stmt.finalize();
});

// 定义返回行的类型
interface SudokuRow {
    puzzle: string;
}

// API: 获取数独题目
app.get('/api/get-sudoku/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    console.log('Fetching puzzle with ID:', id);
    db.get<SudokuRow>("SELECT puzzle FROM sudoku_puzzles WHERE id = ?", [id], (err, row) => {
        if (err || !row) {
            console.error('Puzzle not found:', id);
            res.status(404).send('Puzzle not found');
        } else {
            console.log('Puzzle fetched:', row);
            res.json({ puzzle: JSON.parse(row.puzzle) });
        }
    });
});

//API:保存每一步骤
app.post('/api/save-step', (req: Request, res: Response) => {
    const { puzzle, stepNumber, gameId } = req.body;
    console.log('Received step:', req.body);
    const stmt = db.prepare("INSERT INTO sudoku_steps (game_id, step_number, grid_state) VALUES (?, ?, ?)");
    stmt.run([gameId, stepNumber, JSON.stringify(puzzle)], function (err) {
        if (err) {
            console.error('Error saving step:', err);
            res.status(500).send('Error saving step');
        } else {
            console.log('Step saved with ID:', this.lastID);
            res.status(200).send('Step saved');
        }
    });
    stmt.finalize();
});


//API:保存最终结果
app.post('/api/save-final', (req: Request, res: Response) => {
    const { puzzle, gameId } = req.body;
    console.log('Received final result:', req.body);
    const stmt = db.prepare("INSERT INTO sudoku_results (game_id, grid_state) VALUES (?, ?)");
    stmt.run([gameId, JSON.stringify(puzzle)], function (err) {
        if (err) {
            console.error('Error saving final result:', err);
            res.status(500).send('Error saving final result');
        } else {
            console.log('Final result saved with ID:', this.lastID);
            res.status(200).send('Final result saved');
        }
    });
    stmt.finalize();
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
