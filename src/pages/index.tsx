// src/pages/index.tsx
import React, {useState, useEffect, useRef} from 'react';
import { useRouter } from 'next/router';
import styles from '../app/styles/InitialScreen.module.css';
import{ generateSudokuPuzzle} from './game/[id]'

const Home: React.FC = () => {
    const router = useRouter();
    const [difficulty, setDifficulty]= useState("medium");
    const [isPlaying, setIsPlaying] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current){
            audioRef.current.volume = 0.2; //设置初始音量20%
        }
    },[]);

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
    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
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