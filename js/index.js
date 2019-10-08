"use strict";

const DIRECTIONS_TYPES = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
  DIAGONAL_TOP_LEFT: "DIAGONAL_TOP_LEFT",
  DIAGONAL_TOP_RIGHT: "DIAGONAL_TOP_RIGHT"
};

let currentPlayerX = true;
let player = document.getElementById("player");
const squares = Array(16).fill(null);
const cells = document.querySelectorAll("td");
let isWinner = false;
let winDirection = "";

const move = function(id) {
  if (this.classList.contains("filled") || isWinner) {
    return;
  }

  let mark = document.createElement("div");
  mark.classList.add(currentPlayerX ? "cross" : "circle");

  this.append(mark);
  this.classList.add("filled");

  squares[id] = currentPlayerX;
  player.textContent = currentPlayerX ? "Player: X" : "Player: O";
  currentPlayerX = !currentPlayerX;

  let winnerCell = checkWinningCombination(squares);

  if (winnerCell > 0) {
    let line = document.createElement("div");
    line.classList.add(setDirection(winDirection));

    player.textContent = !currentPlayerX ? "X - WINNER" : "O - WINNER";
    player.classList.add("winner");
    isWinner = true;

    cells[winnerCell].append(line);
  }
};

function checkWinningCombination(squaresArr) {
  return squaresArr.findIndex((cell, index) => {
    if (cell === null) {
      return false;
    }
    return winningCombination(index);
  });
}

// Checkswinning combinations
function winningCombination(cell) {
  // Vertical Winning combination
  if (
    squares[cell] === squares[cell + 1] &&
    squares[cell] === squares[cell + 2]
  ) {
    winDirection = DIRECTIONS_TYPES.HORIZONTAL;
    return true;
  }

  // Gorizontal Winning combination
  if (
    squares[cell] === squares[cell + 4] &&
    squares[cell] === squares[cell + 8]
  ) {
    winDirection = DIRECTIONS_TYPES.VERTICAL;

    return true;
  }

  // Diagonale top-right Winning combinations
  if (
    squares[cell] === squares[cell + 5] &&
    squares[cell] === squares[cell + 10]
  ) {
    winDirection = DIRECTIONS_TYPES.DIAGONAL_TOP_RIGHT;
    return true;
  }

  // Diagonale top-left Winning combinations
  if (
    squares[cell] === squares[cell + 3] &&
    squares[cell] === squares[cell + 6]
  ) {
    winDirection = DIRECTIONS_TYPES.DIAGONAL_TOP_LEFT;
    return true;
  }

  return false;
}
// set class for element
function setDirection(directionType) {
  switch (directionType) {
    case DIRECTIONS_TYPES.HORIZONTAL:
      return "line-horizontal";
    case DIRECTIONS_TYPES.VERTICAL:
      return "line-vertical";
    case DIRECTIONS_TYPES.DIAGONAL_TOP_RIGHT:
      return "line-top-right";
    case DIRECTIONS_TYPES.DIAGONAL_TOP_LEFT:
      return "line-top-left";
    default:
      return;
  }
}

// Attach click event for cells
cells.forEach((cell, index) =>
  cell.addEventListener("click", move.bind(cell, index))
);
