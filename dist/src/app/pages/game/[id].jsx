"use strict";
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
const react_1 = require("react");
const router_1 = require("next/router");
const SudokuGrid_module_css_1 = __importDefault(require("../../styles/SudokuGrid.module.css"));
const loadSudoku = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`http://localhost:3001/api/get-sudoku/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = yield response.json();
    return data.puzzle;
});
const SudokuGame = () => {
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [puzzle, setPuzzle] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (id) {
            console.log('Fetching puzzle for id:', id); // Debugging line
            const fetchPuzzle = () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const puzzle = yield loadSudoku(id);
                    setPuzzle(puzzle);
                }
                catch (error) {
                    console.error('Failed to load puzzle:', error);
                }
            });
            fetchPuzzle();
        }
    }, [id]);
    if (!puzzle) {
        return <div>Loading...</div>;
    }
    return (<div className={SudokuGrid_module_css_1.default.container}>
            <h1>Sudoku Game {id}</h1>
            <div className={SudokuGrid_module_css_1.default.sudokuContainer}>
                <div className={SudokuGrid_module_css_1.default.sudokuBoard}>
                    {puzzle.map((cell, index) => (<input key={index} type='text' maxLength={1} value={cell.value} readOnly={cell.isFixed} className={cell.isFixed ? SudokuGrid_module_css_1.default.fixedCell : SudokuGrid_module_css_1.default.editableCell}/>))}
                </div>
            </div>
        </div>);
};
exports.default = SudokuGame;
