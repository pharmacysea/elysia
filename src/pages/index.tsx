// src/pages/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import styles from '../app/styles/InitialScreen.module.css';

const Home: React.FC = () => {
    const router = useRouter();

    const handleGenerateSudoku = async () => {
        const response = await fetch('/api/save-sudoku', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ difficulty: 'medium' }) // 确保发送difficulty
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
            <button onClick={handleGenerateSudoku}>出题</button>
        </div>
    );
};

export default Home;
