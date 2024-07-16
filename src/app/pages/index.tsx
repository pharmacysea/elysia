import React from "react";
import SudokuGrid from './components/SudokuGrid'

const Home: React.FC = () => {
    return (
        <div>
            <h1>Sudoku Game</h1>
            <SudokuGrid />
        </div>
    );
};

export default Home;