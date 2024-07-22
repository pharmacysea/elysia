"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../../app/styles/SudokuGrid.module.css';

interface Cell {
    value: string;
    isFixed: boolean;
}

// 检查数字是否可以放置在指定位置
const isValid = (grid: Cell[], row: number, col: number, num: string): boolean => {
    for (let i = 0; i < 9; i++) {
        const rowIndex = 9 * row + i;
        const colIndex = 9 * i + col;
        const boxIndex = 9 * (3 * Math.floor(row / 3) + Math.floor(i / 3)) + (3 * Math.floor(col / 3)) + (i % 3);
        if (grid[rowIndex].value === num || grid[colIndex].value === num || grid[boxIndex].value === num) {
            return false;
        }
    }
    return true;
};

// 生成完整的数独网格
const generateCompleteSudoku = (grid: Cell[]): boolean => {
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        if (grid[i].value === '') {
            const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
            while (numbers.length) {
                const num = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
                if (isValid(grid, row, col, num)) {
                    grid[i].value = num;
                    if (generateCompleteSudoku(grid)) {
                        return true;
                    }
                    grid[i].value = '';
                }
            }
            return false;
        }
    }
    return true;
};

// 根据难度生成数独谜题
const generateSudokuPuzzle = (difficulty: string): Cell[] => {
    const grid: Cell[] = Array.from({ length: 81 }, () => ({ value: '', isFixed: false }));
    generateCompleteSudoku(grid);

    const puzzle = grid.map(cell => ({
        ...cell,
        isFixed: true
    }));

    let removalCount;
    if (difficulty === "easy") {
        removalCount = 20;
    } else if (difficulty === "medium") {
        removalCount = 40;
    } else {
        removalCount = 60;
    }

    while (removalCount > 0) {
        const index = Math.floor(Math.random() * 81);
        if (puzzle[index].value !== '') {
            puzzle[index].value = '';
            puzzle[index].isFixed = false;
            removalCount--;
        }
    }

    console.log('Generated puzzle:', puzzle); // 添加日志
    return puzzle;
};

const SudokuGrid: React.FC = () => {
    const router = useRouter();
    const { id, difficulty: queryDifficulty } = router.query; // 获取 URL 中的 difficulty 参数
    const [grid, setGrid] = useState<Cell[]>(Array.from({ length: 81 }, () => ({ value: '', isFixed: false })));
    const [selectedCell, setSelectedCell] = useState<number | null>(null);
    const [difficulty, setDifficulty] = useState(queryDifficulty || "medium"); // 使用 URL 中的 difficulty 参数
    const [timer, setTimer] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [history, setHistory] = useState<Cell[][]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (id) {
            fetch(`/api/get-sudoku?id=${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error fetching puzzle: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Loaded puzzle:', data.puzzle);
                    setGrid(data.puzzle);
                    setHistory([data.puzzle]);
                    // 启动计时器
                    setTimer(0);
                    setIsPaused(false);
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    intervalRef.current = setInterval(() => {
                        setTimer(prevTimer => prevTimer + 1);
                    }, 1000);
                })
                .catch(error => {
                    console.error('Error loading puzzle:', error);
                });
        }
    }, [id]);

    const saveSudoku = async (puzzle: Cell[]) => {
        const response = await fetch('/api/save-sudoku', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ puzzle }),
        });
        const data = await response.json();
        return data.id;
    };

    const handleChange = (index: number, value: string) => {
        if (value < "1" || value > "9" || isNaN(Number(value))) {
            value = "";
        }
        const newGrid = [...grid];
        newGrid[index] = { ...newGrid[index], value };
        setGrid(newGrid);
        setHistory([...history, newGrid]);
    };

    const handleKeyDownInput = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const allowedKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'];
        if (!allowedKeys.includes(event.key)) {
            event.preventDefault();
        }
        if (allowedKeys.includes(event.key)) {
            handleKeyDown(event);
        }
    };

    const generateSudoku = async () => {
        const difficultyString = Array.isArray(difficulty) ? difficulty[0] : difficulty; // 确保传递的是字符串
        const newGrid = generateSudokuPuzzle(difficultyString);
        setGrid(newGrid);
        setHistory([newGrid]);
        setTimer(0);
        setIsPaused(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
        }, 1000);
    
        const id = await saveSudoku(newGrid);
        router.push(`/game/${id}?difficulty=${difficultyString}`);
    };
    

    const resetSudoku = () => {
        const newGrid = history[0];
        setGrid(newGrid);
        setHistory([newGrid]);
    };

    const undoLastStep = () => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop();
            setGrid(newHistory[newHistory.length - 1]);
            setHistory(newHistory);
        }
    };

    const checkSolution = () => {
        if (!Array.isArray(grid)) {
            console.error("Grid is not properly initialized.");
            alert("Grid is not properly initialized.");
            return;
        }

        const isComplete = grid.every(cell => cell.value !== '');

        if (!isComplete) {
            alert("爱莉希雅的贴心提示：你的数独还没有完成哦，加油吧！");
            return;
        }

        const isValidSolution = validateRows(grid) && validateColumns(grid) && validateBoxes(grid);
        if (isValidSolution) {
            alert(`哇！这次的任务用了${timer} 秒完成，得好好奖励一下你呢。`);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        } else {
            alert("我也会读心术，比如，你在想为什么不对，对不对？");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (selectedCell === null) return;

        let newIndex = selectedCell;
        switch (event.key) {
            case 'ArrowUp':
                newIndex = selectedCell - 9 >= 0 ? selectedCell - 9 : selectedCell;
                break;
            case 'ArrowDown':
                newIndex = selectedCell + 9 < 81 ? selectedCell + 9 : selectedCell;
                break;
            case 'ArrowLeft':
                newIndex = selectedCell % 9 !== 0 ? selectedCell - 1 : selectedCell;
                break;
            case 'ArrowRight':
                newIndex = selectedCell % 9 !== 8 ? selectedCell + 1 : selectedCell;
                break;
        }
        setSelectedCell(newIndex);
        inputRefs.current[newIndex]?.focus();
    };

    const togglePause = () => {
        if (isPaused) {
            intervalRef.current = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        setIsPaused(!isPaused);
    };

    useEffect(() => {
        if (selectedCell !== null) {
            inputRefs.current[selectedCell]?.focus();
        }
    }, [selectedCell]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className={styles.container}>
            <h1>Sudoku Game</h1>
            <div className={styles.difficultySelector}>
                难度：
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                </select>
            </div>
            <div className={styles.sudokuContainer}>
                <div className={styles.sudokuBoard} onKeyDown={handleKeyDown} tabIndex={0}>
                    {Array.isArray(grid) && grid.map((cell, index) => (
                        <input
                            key={index}
                            ref={el => {
                                inputRefs.current[index] = el;
                            }}
                            type='text'
                            maxLength={1}
                            value={cell.value}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDownInput(e, index)}
                            className={cell.isFixed ? styles.fixedCell : styles.editableCell}
                            readOnly={cell.isFixed}
                            onFocus={() => setSelectedCell(index)}
                        />
                    ))}
                </div>
                <div className={styles.rightPanel}>
                    <div>计时：{timer} 秒 <button onClick={togglePause}>{isPaused ? "恢复" : "暂停"}</button></div>
                    <button onClick={generateSudoku}>出题</button>
                    <button onClick={undoLastStep}>撤销</button>
                    <button onClick={resetSudoku}>重置</button>
                    <button onClick={checkSolution}>检查答案</button>
                </div>
            </div>
        </div>
    );
};

// 验证行是否有效
const validateRows = (grid: Cell[]): boolean => {
    for (let i = 0; i < 9; i++) {
        const row = grid.slice(i * 9, (i + 1) * 9).map(cell => cell.value);
        const set = new Set(row);
        if (set.size !== 9 || Array.from(set).some(val => val === '')) {
            return false;
        }
    }
    return true;
};

// 验证列是否有效
const validateColumns = (grid: Cell[]): boolean => {
    for (let i = 0; i < 9; i++) {
        const col: string[] = [];
        for (let j = 0; j < 9; j++) {
            col.push(grid[i + j * 9].value);
        }
        const set = new Set(col);
        if (set.size !== 9 || Array.from(set).some(val => val === '')) {
            return false;
        }
    }
    return true;
};

// 验证3x3小格是否有效
const validateBoxes = (grid: Cell[]): boolean => {
    for (let i = 0; i < 9; i++) {
        const box: string[] = [];
        const rowStart = Math.floor(i / 3) * 3;
        const colStart = (i % 3) * 3;
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                box.push(grid[(rowStart + j) * 9 + (colStart + k)].value);
            }
        }
        const set = new Set(box);
        if (set.size !== 9 || Array.from(set).some(val => val === '')) {
            return false;
        }
    }
    return true;
};

export default SudokuGrid;
