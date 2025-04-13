import React, { useState, useEffect } from 'react';
import './App.css';

const initialBoard = Array(9).fill(null);

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]); // 🆕 NEW
  const [mode, setMode] = useState('PVP');
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line); // 🆕 Track winning cells
      updateScore(result.winner);
    }

    if (mode === 'PVC' && !isXTurn && !result) {
      setTimeout(() => {
        aiMove();
      }, 500);
    }
  }, [board, isXTurn]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  const aiMove = () => {
    const available = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    const randomIndex = available[Math.floor(Math.random() * available.length)];

    if (randomIndex !== undefined) {
      const newBoard = [...board];
      newBoard[randomIndex] = 'O';
      setBoard(newBoard);
      setIsXTurn(true);
    }
  };

  const checkWinner = (board) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a, b, c] }; // ✅ updated
      }
    }

    if (board.every(cell => cell)) {
      return { winner: "Draw", line: [] };
    }

    return null;
  };

  const updateScore = (result) => {
    if (result === 'Draw') {
      setScores(prev => ({ ...prev, Draws: prev.Draws + 1 }));
    } else {
      setScores(prev => ({ ...prev, [result]: prev[result] + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsXTurn(true);
    setWinner(null);
    setWinningLine([]); // ✅ reset winning line
  };

  const status = winner
    ? winner === 'Draw'
      ? "It's a Draw!"
      : `${winner} Wins!`
    : `${isXTurn ? 'X' : 'O'}'s Turn`;

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>

      <div className="theme-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <span className="slider round"></span>
        </label>
        <span>{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
      </div>

      <div className="mode-switch">
        <button className={`mode-btn ${mode === 'PVP' ? 'active' : ''}`} onClick={() => setMode('PVP')}>Player vs Player</button>
        <button className={`mode-btn ${mode === 'PVC' ? 'active' : ''}`} onClick={() => setMode('PVC')}>Player vs Computer</button>
      </div>

      <div className="scoreboard">
        <div>X: {scores.X}</div>
        <div>O: {scores.O}</div>
        <div>Draws: {scores.Draws}</div>
      </div>

      <div className="status">{status}</div>

      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${winningLine.includes(index) ? 'winning' : ''}`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      <button className="reset-btn" onClick={resetGame}>Restart Game</button>
    </div>
  );
}

export default App;
