import React,{ useState} from 'react';
import styles from "../components/SudokuGrid.module.css";

const SudokuGrid: React.FC = () => {
    const [grid, setGrid] = useState(Array(81).fill(''));

    const handleChange = (index: number, value: string) => {
        if (value < "1"|| value > "9"|| isNaN(Number(value))){
            value = "";
        }
        const newGrid = [...grid];
        newGrid[index] = value;
        setGrid(newGrid);
    };
    const generateSudoku = () => {
        // Generate sudoku logic here
        setGrid(Array(81).fill(''));
    };
    const checkSolution = () => {
        // Check solution logic here
        alert("Checking solution...");
    };

  return (
    <div>
      <div className={styles.sudokuBoard}>
        {grid.map((value, index) => (
            <input
                key={index}
                type='text'
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
            />
        ))}
        </div>)
        <button onClick={generateSudoku}>出题</button>
        <button onClick={checkSolution}>检查答案</button>

    </div>
  );
};

export default SudokuGrid;