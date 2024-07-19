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

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
