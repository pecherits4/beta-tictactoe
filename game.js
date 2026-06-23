'use strict';

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let scores = { X: 0, O: 0 };
let gameOver = false;

const cells = document.querySelectorAll('.cell');
const boardEl = document.getElementById('board');
const statusArea = document.getElementById('status-area');
const statusPlayer = document.getElementById('status-player');
const statusLabel = statusArea.querySelector('.status-label');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreXBlock = document.getElementById('score-x-block');
const scoreOBlock = document.getElementById('score-o-block');
const btnNewGame = document.getElementById('btn-new-game');

function checkWinner(b) {
  for (const pattern of WIN_PATTERNS) {
    const [a, i, c] = pattern;
    if (b[a] && b[a] === b[i] && b[a] === b[c]) {
      return { winner: b[a], pattern };
    }
  }
  return null;
}

function checkDraw(b) {
  return b.every(cell => cell !== null);
}

function updateScoreboard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

function updateActiveScore() {
  scoreXBlock.classList.toggle('active', currentPlayer === 'X' && !gameOver);
  scoreOBlock.classList.toggle('active', currentPlayer === 'O' && !gameOver);
}

function setStatus(state, player) {
  statusArea.className = 'status-area';

  if (state === 'turn') {
    statusLabel.textContent = 'ХОД';
    statusPlayer.textContent = player;
    if (player === 'O') statusArea.classList.add('turn-o');
  } else if (state === 'win') {
    statusLabel.textContent = 'ПОБЕДА';
    statusPlayer.textContent = player;
    statusArea.classList.add('win');
  } else if (state === 'draw') {
    statusLabel.textContent = 'НИЧЬЯ';
    statusPlayer.textContent = '';
    statusArea.classList.add('draw');
  }
}

function renderCell(index) {
  const cell = cells[index];
  const value = board[index];
  cell.textContent = value || '';
  cell.classList.toggle('filled', value !== null);
  cell.classList.toggle('x-cell', value === 'X');
  cell.classList.toggle('o-cell', value === 'O');
  cell.disabled = value !== null || gameOver;
}

function handleCellClick(e) {
  const index = Number(e.currentTarget.dataset.index);
  if (board[index] !== null || gameOver) return;

  board[index] = currentPlayer;
  renderCell(index);

  const result = checkWinner(board);
  if (result) {
    gameOver = true;
    scores[result.winner]++;
    updateScoreboard();
    result.pattern.forEach(i => cells[i].classList.add('winning-cell'));
    boardEl.classList.add('game-over');
    cells.forEach(c => { c.disabled = true; });
    setStatus('win', result.winner);
    updateActiveScore();
    return;
  }

  if (checkDraw(board)) {
    gameOver = true;
    boardEl.classList.add('game-over');
    cells.forEach(c => { c.disabled = true; });
    setStatus('draw', null);
    updateActiveScore();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setStatus('turn', currentPlayer);
  updateActiveScore();
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;

  boardEl.classList.remove('game-over');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.disabled = false;
  });

  setStatus('turn', currentPlayer);
  updateActiveScore();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
btnNewGame.addEventListener('click', resetGame);

setStatus('turn', currentPlayer);
updateActiveScore();
updateScoreboard();
