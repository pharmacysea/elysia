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
// src/pages/index.tsx
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const InitialScreen_module_css_1 = __importDefault(require("../app/styles/InitialScreen.module.css"));
const _id_1 = require("./game/[id]");
const Home = () => {
    const router = (0, router_1.useRouter)();
    const [difficulty, setDifficulty] = (0, react_1.useState)("medium");
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(true);
    const audioRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (audioRef.current) {
            audioRef.current.volume = 1.0; //设置初始音量100%
        }
    }, []);
    const handleGenerateSudoku = () => __awaiter(void 0, void 0, void 0, function* () {
        const newGrid = (0, _id_1.generateSudokuPuzzle)(difficulty); //生成指定难度数独
        const response = yield fetch('/api/save-sudoku', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ puzzle: newGrid, difficulty }) // 传递difficulty
        });
        if (!response.ok) {
            console.error('Error generating puzzle:', response.statusText);
            return;
        }
        const data = yield response.json();
        router.push(`/game/${data.id}`);
    });
    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            }
            else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    return (<div className={InitialScreen_module_css_1.default.container}>
          <h1>Elysia的数独游戏</h1>
          <div>
              <label htmlFor="difficulty">选择难度:</label>
              <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="easy">简单</option>
                  <option value="medium">中等</option>
                  <option value="hard">困难</option>
              </select>
          </div>
          <button onClick={handleGenerateSudoku}>出题</button>
          <audio ref={audioRef} src='/audio/bgm.MP4' autoPlay loop/>
          <div className={InitialScreen_module_css_1.default.musicControl} onClick={toggleMusic}>
            <div className={InitialScreen_module_css_1.default.musicIcon}></div>
          </div>
      </div>);
};
exports.default = Home;
