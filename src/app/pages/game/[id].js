import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "../../styles/SudokuGrid.module.css";

const loadSudoku = async (id) => {
    const response = await fetch(`http://localhost:3001/api/get-sudoku/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.puzzle;
};

const SudokuGame = () => {
    const router = useRouter();
    const { id } = router.query;
    const [puzzle, setPuzzle] = useState(null);

    useEffect(() => {
        if (id) {
            console.log('Fetching puzzle for id:', id); // Debugging line
            const fetchPuzzle = async () => {
                try {
                    const puzzle = await loadSudoku(id);
                    setPuzzle(puzzle);
                } catch (error) {
                    console.error('Failed to load puzzle:', error);
                }
            };
            fetchPuzzle();
        }
    }, [id]);

    if (!puzzle) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Sudoku Game {id}</h1>
            <div className={styles.sudokuContainer}>
                <div className={styles.sudokuBoard}>
                    {puzzle.map((cell, index) => (
                        <input
                            key={index}
                            type='text'
                            maxLength={1}
                            value={cell.value}
                            readOnly={cell.isFixed}
                            className={cell.isFixed ? styles.fixedCell : styles.editableCell}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SudokuGame;
