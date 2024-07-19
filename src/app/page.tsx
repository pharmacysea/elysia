// src/pages/index.tsx
import React from 'react';
import SudokuGrid from "./components/SudokuGrid"; // 确保路径正确
const Home: React.FC = () => {
  return (
    <div>
      <h1>Elysia♪的数独游戏</h1>
      <SudokuGrid /> {/* 使用SudokuGrid组件 */}
    </div>
  );
};

export default Home;
