// SudokuGrid.tsx
"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const SudokuGrid_module_css_1 = __importDefault(require("../styles/SudokuGrid.module.css"));
const isValid = (grid, row, col, num) => {
    // 检查行、列和3x3子网格是否符合数独规则
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
const generateCompleteSudoku = (grid) => {
    // 递归生成一个完整的数独网格
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
const generateSudokuPuzzle = (difficulty) => {
    // 生成一个完整的数独并根据难度移除部分数字
    const grid = Array.from({ length: 81 }, () => ({ value: '', isFixed: false }));
    generateCompleteSudoku(grid);
    const puzzle = grid.map(cell => (Object.assign(Object.assign({}, cell), { isFixed: true })));
    let removalCount;
    if (difficulty === "easy") {
        removalCount = 20;
    }
    else if (difficulty === "medium") {
        removalCount = 40;
    }
    else {
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
    return puzzle;
};
const validateRows = (grid) => {
    // 验证每一行是否符合数独规则
    for (let i = 0; i < 9; i++) {
        const row = grid.slice(i * 9, (i + 1) * 9).map(cell => cell.value);
        const set = new Set(row);
        if (set.size !== 9 || Array.from(set).some(val => val === '')) {
            return false;
        }
    }
    return true;
};
const validateColumns = (grid) => {
    // 验证每一列是否符合数独规则
    for (let i = 0; i < 9; i++) {
        const col = [];
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
const validateBoxes = (grid) => {
    // 验证每一个3x3子网格是否符合数独规则
    for (let i = 0; i < 9; i++) {
        const box = [];
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
const SudokuGrid = () => {
    const [grid, setGrid] = (0, react_1.useState)(Array.from({ length: 81 }, () => ({ value: '', isFixed: false })));
    const [selectedCell, setSelectedCell] = (0, react_1.useState)(null);
    const [difficulty, setDifficulty] = (0, react_1.useState)("medium");
    const [timer, setTimer] = (0, react_1.useState)(0);
    const [isPaused, setIsPaused] = (0, react_1.useState)(false);
    const [history, setHistory] = (0, react_1.useState)([]);
    const intervalRef = (0, react_1.useRef)(null);
    const inputRefs = (0, react_1.useRef)([]);
    const saveSudoku = (puzzle) => __awaiter(void 0, void 0, void 0, function* () {
        // 将数独保存到后端并获取唯一ID
        const response = yield fetch('http://localhost:3001/api/save-sudoku', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ puzzle }),
        });
        const data = yield response.json();
        return data.id;
    });
    const handleChange = (index, value) => {
        // 处理单元格值的变化
        if (value < "1" || value > "9" || isNaN(Number(value))) {
            value = "";
        }
        const newGrid = [...grid];
        newGrid[index] = Object.assign(Object.assign({}, newGrid[index]), { value });
        setGrid(newGrid);
        setHistory([...history, newGrid]);
    };
    const handleKeyDownInput = (event, index) => {
        // 处理键盘输入，限制只能输入数字
        const allowedKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'];
        if (!allowedKeys.includes(event.key)) {
            event.preventDefault();
        }
        if (allowedKeys.includes(event.key)) {
            handleKeyDown(event);
        }
    };
    const generateSudoku = () => __awaiter(void 0, void 0, void 0, function* () {
        // 生成数独并开始计时
        const newGrid = generateSudokuPuzzle(difficulty);
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
        const id = yield saveSudoku(newGrid);
        window.location.href = `/game/${id}`;
    });
    const resetSudoku = () => {
        // 重置数独到初始状态
        const newGrid = history[0];
        setGrid(newGrid);
        setHistory([newGrid]);
    };
    const undoLastStep = () => {
        // 撤销上一步操作
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop();
            setGrid(newHistory[newHistory.length - 1]);
            setHistory(newHistory);
        }
    };
    const checkSolution = () => {
        // 检查当前数独是否正确
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
        }
        else {
            alert("我也会读心术，比如，你在想为什么不对，对不对？");
        }
    };
    const handleKeyDown = (event) => {
        var _a;
        // 处理键盘箭头按键移动焦点
        if (selectedCell === null)
            return;
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
        (_a = inputRefs.current[newIndex]) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const togglePause = () => {
        // 暂停和恢复计时
        if (isPaused) {
            intervalRef.current = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
        }
        else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        setIsPaused(!isPaused);
    };
    (0, react_1.useEffect)(() => {
        var _a;
        if (selectedCell !== null) {
            (_a = inputRefs.current[selectedCell]) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [selectedCell]);
    (0, react_1.useEffect)(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
    return (<div className={SudokuGrid_module_css_1.default.container}>
            <h1>Sudoku Game</h1>
            <div className={SudokuGrid_module_css_1.default.difficultySelector}>
                难度：
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                </select>
            </div>
            <div className={SudokuGrid_module_css_1.default.sudokuContainer}>
                <div className={SudokuGrid_module_css_1.default.sudokuBoard} onKeyDown={handleKeyDown} tabIndex={0}>
                    {Array.isArray(grid) && grid.map((cell, index) => (<input key={index} ref={el => {
                inputRefs.current[index] = el;
            }} type='text' maxLength={1} value={cell.value} onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDownInput(e, index)} className={cell.isFixed ? SudokuGrid_module_css_1.default.fixedCell : SudokuGrid_module_css_1.default.editableCell} readOnly={cell.isFixed} onFocus={() => setSelectedCell(index)}/>))}
                </div>
                <div className={SudokuGrid_module_css_1.default.rightPanel}>
                    <div>计时：{timer} 秒 <button onClick={togglePause}>{isPaused ? "恢复" : "暂停"}</button></div>
                    <button onClick={generateSudoku}>出题</button>
                    <button onClick={undoLastStep}>撤销</button>
                    <button onClick={resetSudoku}>重置</button>
                    <button onClick={checkSolution}>检查答案</button>
                </div>
            </div>
        </div>);
};
exports.default = SudokuGrid;
