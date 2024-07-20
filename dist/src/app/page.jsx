"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/pages/index.tsx
const react_1 = __importDefault(require("react"));
const SudokuGrid_1 = __importDefault(require("./components/SudokuGrid")); // 确保路径正确
const Home = () => {
    return (<div>
      <h1>Elysia♪的数独游戏</h1>
      <SudokuGrid_1.default /> {/* 使用SudokuGrid组件 */}
    </div>);
};
exports.default = Home;
