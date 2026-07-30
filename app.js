const BOARD_SIZE = 8;

const boardEl = document.getElementById('board');
const moveCountEl = document.getElementById('moveCount');
const undoBtn = document.getElementById('undoBtn');
const retryBtn = document.getElementById('retryBtn');
const newBtn = document.getElementById('newBtn');
const endModal = document.getElementById('endModal');
const modalRetry = document.getElementById('modalRetry');
const modalNew = document.getElementById('modalNew');

let grid = [];
let visited = new Array(BOARD_SIZE).fill(0).map(() => new Array(BOARD_SIZE).fill(false));
let moves = [];
let current = null; // [r,c]
let initialStart = null; // 保存本局随机起点，用于重试

function createBoard() {
    boardEl.innerHTML = '';
    grid = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        const row = [];
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell ' + (((r + c) % 2 === 0) ? 'light' : 'dark');
            cell.dataset.r = r; cell.dataset.c = c;
            const lbl = document.createElement('div'); lbl.className = 'label'; cell.appendChild(lbl);
            cell.addEventListener('click', onCellClick);
            cell.addEventListener('mouseenter', onCellEnter);
            cell.addEventListener('mouseleave', onCellLeave);
            boardEl.appendChild(cell);
            row.push(cell);
        }
        grid.push(row);
    }
}

function randStart() {
    const r = Math.floor(Math.random() * BOARD_SIZE);
    const c = Math.floor(Math.random() * BOARD_SIZE);
    return [r, c];
}

function setStart(pos) {
    visited = new Array(BOARD_SIZE).fill(0).map(() => new Array(BOARD_SIZE).fill(false));
    moves = [];
    current = pos.slice();
    visited[pos[0]][pos[1]] = true;
    moves.push(pos.slice());
    render();
}

function render() {
    // clear labels
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const el = grid[r][c];
            el.classList.remove('visited', 'legal', 'current');
            el.querySelector('.label').textContent = '';
        }
    }
    // show numbers
    for (let i = 0; i < moves.length; i++) {
        const [r, c] = moves[i];
        const el = grid[r][c];
        el.classList.add('visited');
        el.querySelector('.label').textContent = String(i);
    }
    if (current) {
        grid[current[0]][current[1]].classList.add('current');
    }
    moveCountEl.textContent = (moves.length - 1).toString();
    // mark legal moves
    const legal = getLegalMoves(current[0], current[1]);
    let has = false;
    for (const [r, c] of legal) {
        grid[r][c].classList.add('legal'); has = true;
    }
    if (!has) checkEnd();
}

function getLegalMoves(r, c) {
    const deltas = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
    const res = [];
    for (const [dr, dc] of deltas) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && !visited[nr][nc]) res.push([nr, nc]);
    }
    return res;
}

function onCellEnter(e) {
    const el = e.currentTarget;
    if (el.classList.contains('legal')) el.style.filter = 'brightness(0.97)';
}
function onCellLeave(e) {
    const el = e.currentTarget;
    el.style.filter = '';
}

function onCellClick(e) {
    const el = e.currentTarget;
    const r = +el.dataset.r, c = +el.dataset.c;
    if (!el.classList.contains('legal')) return;
    makeMove(r, c);
}

function makeMove(r, c) {
    visited[r][c] = true;
    current = [r, c];
    moves.push([r, c]);
    render();
}

function undo() {
    if (moves.length <= 1) return;
    const last = moves.pop();
    visited[last[0]][last[1]] = false;
    current = moves[moves.length - 1].slice();
    render();
}

function checkEnd() {
    // no legal move from current
    showEnd();
}

function showEnd() {
    endModal.classList.remove('hidden');
}

function hideEnd() {
    endModal.classList.add('hidden');
}


undoBtn.addEventListener('click', () => { undo(); });
retryBtn.addEventListener('click', () => { if (initialStart) setStart(initialStart); hideEnd(); });
newBtn.addEventListener('click', () => { const s = randStart(); initialStart = s.slice(); setStart(s); hideEnd(); });
modalRetry.addEventListener('click', () => { retryBtn.click(); });
modalNew.addEventListener('click', () => { newBtn.click(); });

// init
createBoard();
const start = randStart();
initialStart = start.slice();
setStart(start);
