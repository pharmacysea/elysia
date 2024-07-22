// src/pages/index.tsx
"use client"
import React from 'react';
import { useRouter } from 'next/router';
import styles from "../styles/InitialScreen.module.css";  // 确保样式文件存在

const InitialScreen: React.FC = () => {
    const router = useRouter();

    const generateSudoku = async () => {
        const response = await fetch('/api/save-sudoku', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        router.push(`/game/${data.id}`);
    };

    return (
        <div className={styles.container}>
            <h1>Elysia的数独游戏</h1>
            <button onClick={generateSudoku}>出题</button>
        </div>
    );
};

export default InitialScreen;
