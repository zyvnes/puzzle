const puzzles = [
  { img: "images/puzzle1.jpg", size: 4 },
  { img: "images/puzzle2.jpg", size: 5 },
  { img: "images/puzzle3.jpg", size: 6 }
];

let currentPuzzle = 0;

document.getElementById("startPuzzle1").onclick = () => startPuzzle(0);
document.getElementById("startPuzzle2").onclick = () => startPuzzle(1);
document.getElementById("startPuzzle3").onclick = () => startPuzzle(2);

/* ------------------ PUZZLE LOGIC ------------------ */

function startPuzzle(num) {
  currentPuzzle = num;
  const puzzle = puzzles[num];
  const gridSize = puzzle.size;

  document.getElementById("puzzleTitle").innerText =
    `Puzzle ${num + 1}: ${gridSize} x ${gridSize}`;

  const container = document.getElementById("puzzleContainer");
  container.innerHTML = ""; // clear
  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  // Create pieces
  let pieces = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
    let piece = document.createElement("div");
    piece.classList.add("piece");
    piece.draggable = true;

    let x = i % gridSize;
    let y = Math.floor(i / gridSize);

    piece.style.backgroundImage = `url(${puzzle.img})`;
    piece.style.backgroundPosition = `${(x / (gridSize - 1)) * 100}% ${(y / (gridSize - 1)) * 100}%`;

    piece.correctIndex = i;
    pieces.push(piece);
  }

  // Shuffle pieces
  pieces = shuffleArray(pieces);

  // Add drag-drop functionality
  pieces.forEach((piece, i) => {
    piece.currentIndex = i;
    piece.addEventListener("dragstart", dragStart);
    piece.addEventListener("dragover", dragOver);
    piece.addEventListener("drop", dropped);
    container.appendChild(piece);
  });
}

let draggedPiece = null;

function dragStart(e) {
  draggedPiece = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dropped() {
  const tempIndex = this.currentIndex;
  this.currentIndex = draggedPiece.currentIndex;
  draggedPiece.currentIndex = tempIndex;

  const container = document.getElementById("puzzleContainer");
  const children = Array.from(container.children);

  container.innerHTML = "";
  children.sort((a, b) => a.currentIndex - b.currentIndex);
  children.forEach(c => container.appendChild(c));

  checkSolved();
}

function checkSolved() {
  const container = document.getElementById("puzzleContainer");
  const pieces = Array.from(container.children);

  const solved = pieces.every((p, i) => p.correctIndex === i);

  if (solved) {
    setTimeout(() => {
      alert(`Puzzle ${currentPuzzle + 1} completed!`);

      if (currentPuzzle === 0)
        document.getElementById("startPuzzle2").disabled = false;
      if (currentPuzzle === 1)
        document.getElementById("startPuzzle3").disabled = false;
    }, 200);
  }
}

/* Utility shuffle */
function shuffleArray(arr) {
  return arr
    .map(v => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(obj => obj.v);
}
