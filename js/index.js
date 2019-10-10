"use strict";

const DIRECTIONS_TYPES = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
  DIAGONAL_TOP_LEFT: "DIAGONAL_TOP_LEFT",
  DIAGONAL_TOP_RIGHT: "DIAGONAL_TOP_RIGHT"
};

const playButton = document.getElementById("playButton");
const cells = document.querySelectorAll("td");
const player = document.getElementById("player");
let table;
let currentPlayerX = true;
let isWinner = false;
let winDirection = "";
let isTableCreated = false;

playButton.addEventListener("click", createTable);

function move(rowIndex, columnIndex) {
  if (this.classList.contains("filled") || isWinner) {
    return;
  }

  let mark = document.createElement("div");
  mark.classList.add(currentPlayerX ? "cross" : "circle");

  this.append(mark);
  this.classList.add("filled");

  table[rowIndex][columnIndex] = currentPlayerX;
  currentPlayerX = !currentPlayerX;
  player.textContent = currentPlayerX ? "Player: X" : "Player: O";

  const result = checkWinningCombination(table);
  console.log(result);
  if (result) {
    const [winningRowIndex, winningColumnIndex] = [...result];
    const line = document.createElement("div");
    line.classList.add(setDirection(winDirection));

    player.textContent = !currentPlayerX ? "X - WINNER" : "O - WINNER";
    player.classList.add("winner");
    isWinner = !isWinner;

    const rows = document.querySelectorAll("tr");
    rows[winningRowIndex]
      .querySelectorAll("td")
      [winningColumnIndex].append(line);
  }
}

function checkWinningCombination(table) {
  for (let rowIndex = 0; rowIndex < table.length; rowIndex++) {
    for (
      let columnIndex = 0;
      columnIndex < table[rowIndex].length;
      columnIndex++
    ) {
      if (winningCombinations(table, rowIndex, columnIndex)) {
        return [rowIndex, columnIndex];
      }
    }
  }
}

function winningCombinations(table, rowIndex, columnIndex) {
  if (table[rowIndex][columnIndex] === null) return false;
  // HORIZONTAL WIN
  if (
    //
    table[rowIndex][columnIndex] === table[rowIndex][columnIndex + 1] &&
    table[rowIndex][columnIndex] === table[rowIndex][columnIndex + 2]
  ) {
    winDirection = DIRECTIONS_TYPES.HORIZONTAL;
    return true;
  }
  // VERTICAL WIN
  if (
    table[rowIndex][columnIndex] === table[rowIndex + 1][columnIndex] &&
    table[rowIndex][columnIndex] === table[rowIndex + 2][columnIndex]
  ) {
    winDirection = DIRECTIONS_TYPES.VERTICAL;
    return true;
  }
  // DIAGONAL TOP RIGHT WIN
  if (
    table[rowIndex][columnIndex] === table[rowIndex + 1][columnIndex + 1] &&
    table[rowIndex][columnIndex] === table[rowIndex + 2][columnIndex + 2]
  ) {
    winDirection = DIRECTIONS_TYPES.DIAGONAL_TOP_RIGHT;
    return true;
  }
  // DIAGONAL TOP LEFT WIN
  if (
    table[rowIndex][columnIndex] === table[rowIndex + 1][columnIndex - 1] &&
    table[rowIndex][columnIndex] === table[rowIndex + 2][columnIndex - 2]
  ) {
    winDirection = DIRECTIONS_TYPES.DIAGONAL_TOP_LEFT;
    return true;
  }
  return false;
}

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

function createTable(event) {
  event.preventDefault();
  player.textContent = "Player: X";
  // Get value from inputs, convert them to int
  const rowsCount = +document.getElementById("rowsCount").value;
  const columnsCount = +document.getElementById("columnsCount").value;
  // Check min and max sizes
  if (
    rowsCount < 3 ||
    rowsCount > 10 ||
    (columnsCount < 3 || columnsCount > 10)
  )
    return;

  // searching tbody for future elements insertion
  const tbody = document.getElementById("tic-tac-toe").firstElementChild;

  // Create and fill two dimention virtual array
  table = new Array(rowsCount)
    .fill(null)
    .map(item => new Array(columnsCount).fill(null));
  console.log(table);
  // Inser table to HTML
  if (isTableCreated) {
    const newTbody = document.createElement("tbody");
    newTbody.append(...[...drawTable(table)]);

    tbody.replaceWith(newTbody);

    isWinner = false;
    currentPlayerX = true;
    player.classList.remove("winner");
    player.textContent = currentPlayerX ? "Player: X" : "Player: O";
  } else {
    tbody.append(...[...drawTable(table)]);
    isTableCreated = true;
  }
}

function drawTable(table) {
  // Creates DOM tree based on virtual two-dimention array
  return table.map((row, rowIndex) => {
    const tableRow = document.createElement("tr");
    const tableColumns = row.map((cell, columnIndex) => {
      const tableColumn = document.createElement("td");
      tableColumn.addEventListener(
        "click",
        move.bind(tableColumn, rowIndex, columnIndex)
      );

      return tableColumn;
    });
    // Insert cells in row
    tableRow.append(...tableColumns);
    return tableRow;
  });
}
