let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let mode = 'pvp';
const stats = { X: 0, O: 0, draws: 0 };
const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];
const boardEl = document.getElementById('board');
const messageEl = document.getElementById('message');
const rematchBtn = document.getElementById('rematch-btn');
const resetBtn = document.getElementById('reset-btn');
const xWinsEl = document.getElementById('x-wins');
const oWinsEl = document.getElementById('o-wins');
const drawsEl = document.getElementById('draws');
const modeInputs = document.querySelectorAll('input[name="mode"]');

function renderBoard(){
  boardEl.innerHTML = '';
  board.forEach((cell, idx) => {
    const div = document.createElement('div');
    div.className = 'cell';
    div.dataset.index = idx;
    if(cell){
      div.textContent = cell;
      div.classList.add(cell.toLowerCase(),'disabled');
    }
    div.addEventListener('click', () => handleCellClick(idx));
    boardEl.appendChild(div);
  });
}
function updateMessage(t){ messageEl.textContent = t; }
function checkGameEnd(){
  for(const [a,b,c] of wins){
    if(board[a] && board[a]===board[b] && board[a]===board[c])
      return {winner: board[a], line:[a,b,c]};
  }
  if(board.every(c=>c!==null)) return {winner:null};
  return null;
}
function highlightLine(line){
  if(!line) return;
  line.forEach(i=>boardEl.querySelector(`.cell[data-index='${i}']`).classList.add('win'));
}
function handleCellClick(i){
  if(gameOver || board[i]!==null) return;
  board[i]=currentPlayer;
  renderBoard();
  const res=checkGameEnd();
  if(res){endGame(res);return;}
  currentPlayer=currentPlayer==='X'?'O':'X';
  updateMessage(`Player ${currentPlayer}'s turn`);
  if(mode==='ai'&&currentPlayer==='O'&&!gameOver) aiMove();
}
function aiMove(){
  const empties=board.map((v,i)=>v===null?i:null).filter(v=>v!==null);
  if(empties.length===0)return;
  const c=empties[Math.floor(Math.random()*empties.length)];
  board[c]='O'; renderBoard();
  const res=checkGameEnd();
  if(res){endGame(res);return;}
  currentPlayer='X'; updateMessage(`Player ${currentPlayer}'s turn`);
}
function endGame(r){
  gameOver=true;
  if(r.winner){highlightLine(r.line);updateMessage(`Player ${r.winner} wins!`);stats[r.winner]++;}
  else{updateMessage(`It's a draw!`);stats.draws++;}
  updateStatsUI();
}
function updateStatsUI(){
  xWinsEl.textContent=stats.X;oWinsEl.textContent=stats.O;drawsEl.textContent=stats.draws;
}
function rematch(){board=Array(9).fill(null);currentPlayer='X';gameOver=false;renderBoard();updateMessage(`Player ${currentPlayer}'s turn`);}
function resetAll(){rematch();stats.X=0;stats.O=0;stats.draws=0;updateStatsUI();}
modeInputs.forEach(i=>i.addEventListener('change',e=>{mode=e.target.value;rematch();}));
rematchBtn.addEventListener('click',rematch);
resetBtn.addEventListener('click',resetAll);
renderBoard();updateMessage(`Player ${currentPlayer}'s turn`);updateStatsUI();