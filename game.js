'use strict';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let scores = { X: 0, O: 0, draws: 0 };

const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const xWinsEl = document.getElementById('x-wins');
const oWinsEl = document.getElementById('o-wins');
const drawsEl = document.getElementById('draws');
const restartBtn = document.getElementById('restart-btn');
const resetScoreBtn = document.getElementById('reset-score-btn');

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = 'status' + (cls ? ' ' + cls : '');
}

function updateScoreboard() {
  xWinsEl.textContent = scores.X;
  oWinsEl.textContent = scores.O;
  drawsEl.textContent = scores.draws;
}

function checkWinner() {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(cell => cell !== null)) {
    return { winner: null, draw: true };
  }
  return null;
}

function handleCellClick(e) {
  const index = parseInt(e.target.dataset.index, 10);

  if (gameOver || board[index] !== null) return;

  board[index] = currentPlayer;
  const cell = e.target;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase(), 'taken');

  const result = checkWinner();

  if (result) {
    gameOver = true;
    if (result.draw) {
      scores.draws++;
      setStatus("It's a draw!", 'draw');
    } else {
      scores[result.winner]++;
      result.line.forEach(i => cells[i].classList.add('winning'));
      setStatus(`Player ${result.winner} wins!`, 'winner');
    }
    updateScoreboard();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setStatus(`Player ${currentPlayer}'s turn`, currentPlayer === 'X' ? 'x-turn' : 'o-turn');
}

function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });

  setStatus("Player X's turn", 'x-turn');
}

function resetScores() {
  scores = { X: 0, O: 0, draws: 0 };
  updateScoreboard();
  restartGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
resetScoreBtn.addEventListener('click', resetScores);

// Init
setStatus("Player X's turn", 'x-turn');
