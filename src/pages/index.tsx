// src/pages/index.tsx
import React, {useState} from 'react';
import { useRouter } from 'next/router';
import styles from '../app/styles/InitialScreen.module.css';
import{ generateSudokuPuzzle} from './game/[id]'

const Home: React.FC = () => {
    const router = useRouter();
    const [difficulty, setDifficulty]= useState("medium");

    const handleGenerateSudoku = async () => {
        const newGrid = generateSudokuPuzzle(difficulty);//生成指定难度数独
        const response = await fetch('/api/save-sudoku', {
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
        const data = await response.json();
        router.push(`/game/${data.id}`);
    };

    return (
      <div className={styles.container}>
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
      </div>
  );
};

export default Home;