'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // #region DECLARE VARIABLES

  const body = document.querySelector('body');
  const squareContainer = document.querySelector('.square-container');
  const resetButton = document.querySelector('.reset-button');
  const key = document.querySelector('.key');
  const densityRange = document.querySelector('.density');
  const defaultValue = 50;
  let numberOfSquares = defaultValue;
  const squareContainerWidthAndHeight = { 'width': 500, 'height': 500 };
  let squareWidthAndHeight = { 'width': squareContainerWidthAndHeight.width / numberOfSquares, 'height': squareContainerWidthAndHeight.height / numberOfSquares };
  let tableData = [];
  let tableDataClone = tableData;
  let colors;
  const angle = 0.5;

  // #endregion

  // set density range's default value, which must be always equal to the number of squares
  densityRange.value = numberOfSquares;

  // set container dimensions
  squareContainer.style.width = `${squareContainerWidthAndHeight.width}px`;
  squareContainer.style.height = `${squareContainerWidthAndHeight.height}px`;

  // #region MAIN FUNCTIONS

  /**
   * Creates squares to fill table
   */
  function createTable() {
    const rows = numberOfSquares;
    const columns = numberOfSquares;

    colors = getRandomColors(defaultValue);

    // create 2 dimensional data array with squares
    for (let i = 0; i < rows; i++) {
      tableData.push([]);

      for (let j = 0; j < columns; j++) {
        let square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('square-row-id', i);
        square.setAttribute('square-col-id', j);
        squareContainer.appendChild(square);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // set square's random color
        square.style.backgroundColor = randomColor;

        // set square's dimension
        square.style.width = `${squareWidthAndHeight.width}px`;
        square.style.height = `${squareWidthAndHeight.height}px`;

        // listen clicks for toggle class
        // TODO if square is active, moving the table will screw up the active squares!
        // square.addEventListener('click', () => paintSquare(square, '#000000'));

        // TODO optimalizations: try to avoid passing DOM element
        // add element to table array
        tableData[i].push({ 'id': i + j, 'element': square, 'color': randomColor, 'row': i, 'column': j });

      }
    }

    // clone tableData without references to access previous values
    tableDataClone = JSON.parse(JSON.stringify(tableData));
  }

  /**
   * Add new colors to tableData's elements' neighbours, based on direction
   * @param {string} direction: determines which way to go, can be LEFT, RIGHT, UP, DOWN
   */
  function moveTable(direction) {
    // TODO optimalizations (e.g. if color is same, skip?)
    switch (direction) {
      case 'RIGHT': // check every row's every column's n + 1 color's and switch n's color to that as well
        for (let row = 0; row < tableData.length; row++) {
          for (let col = 0; col < tableData[row].length; col++) {
            tableData[row][col].element.style.backgroundColor = tableDataClone[row][(col - 1) < 0 ? tableData[row].length - 1 : col - 1].color;
            tableData[row][col].color = tableDataClone[row][(col - 1) < 0 ? tableData[row].length - 1 : col - 1].color;
          }
        }
        squareContainer.style.transform = `rotateY(${angle}deg)`;
        break;
      case 'LEFT': // check every row's every column's n - 1 color's and switch n's color to that as well
        for (let row = 0; row < tableData.length; row++) {
          for (let col = 0; col < tableData[row].length; col++) {
            tableData[row][col].element.style.backgroundColor = tableDataClone[row][(col + 1) > tableData[row].length - 1 ? 0 : col + 1].color;
            tableData[row][col].color = tableDataClone[row][(col + 1) > tableData[row].length - 1 ? 0 : col + 1].color;
          }
        }
        squareContainer.style.transform = `rotateY(-${angle}deg)`;
        break;
      case 'UP': // check every row's every column's n + 1 color's and switch n's color to that as well
        for (let row = 0; row < tableData.length; row++) {
          for (let col = 0; col < tableData[row].length; col++) {
            tableData[row][col].element.style.backgroundColor = tableDataClone[(row + 1) > tableData.length - 1 ? 0 : row + 1][col].color;
            tableData[row][col].color = tableDataClone[(row + 1) > tableData.length - 1 ? 0 : row + 1][col].color;
          }
        }
        squareContainer.style.transform = `rotateX(${angle}deg)`;
        break;
      case 'DOWN': // check every row's every column's n - 1 color's and switch n's color to that as well
        for (let row = 0; row < tableData.length; row++) {
          for (let col = 0; col < tableData[row].length; col++) {
            tableData[row][col].element.style.backgroundColor = tableDataClone[(row - 1) < 0 ? tableData.length - 1 : row - 1][col].color;
            tableData[row][col].color = tableDataClone[(row - 1) < 0 ? tableData.length - 1 : row - 1][col].color;
          }
        }
        squareContainer.style.transform = `rotateX(-${angle}deg)`;
        break;

      default:
        break;
    }

    // update clone
    tableDataClone = JSON.parse(JSON.stringify(tableData));
  }

  /**
   * Resetting table, either does a hard reset, or a soft
   * @param {boolean} isPure: if true, its does a total reset, otherwise keeps some previous settings
   */
  function reset(isPure) {
    const squares = squareContainer.querySelectorAll('.square');
    for (let i = 0; i < squares.length; i++) {
      squares[i].remove();
    }
    tableData = [];
    squareContainer.style.transform = 'none';

    // only set new values if its pure reset
    if (isPure) {
      numberOfSquares = defaultValue;
      densityRange.value = numberOfSquares;
      squareWidthAndHeight = { 'width': squareContainerWidthAndHeight.width / numberOfSquares, 'height': squareContainerWidthAndHeight.height / numberOfSquares };
    }
    createTable();
  }

  // #endregion

  // #region EVENT LISTENERS

  resetButton.addEventListener('click', () => reset(true));

  densityRange.addEventListener('mouseup', (ev) => {
    numberOfSquares = ev.target.value;
    squareWidthAndHeight = { 'width': squareContainerWidthAndHeight.width / numberOfSquares, 'height': squareContainerWidthAndHeight.height / numberOfSquares };
    reset(false);
  });

  body.addEventListener('keydown', (event) => {
    if (!event.metaKey) {
      event.preventDefault();
    }

    switch (event.keyCode) {
      case 87:
      case 38:
        key.innerHTML = 'W or UP';
        moveTable('UP');
        break;
      case 83:
      case 40:
        key.innerHTML = 'S or DOWN';
        moveTable('DOWN');
        break;
      case 68:
      case 39:
        key.innerHTML = 'D or RIGHT';
        moveTable('RIGHT');
        break;
      case 65:
      case 37:
        key.innerHTML = 'A or LEFT';
        moveTable('LEFT');
        break;
      case 27:
        key.innerHTML = 'ESC';
        break;
      case 32:
        reset(false);
        key.innerHTML = 'SPACE';
        break;
      case 13:
        key.innerHTML = 'ENTER';
        break;

      default:
        break;
    }
  });

  // #endregion

  // #region HELPER FUNCTIONS

  /**
   * Paints specific square on table
   * needs a specific color, but on second click, it gets a random from the colors pool
   * @param {HTMLDivElement} square: the DOM element
   * @param {string} color: the element's new color
   */
  function paintSquare(square, color) {
    if (tableData[parseInt(square.getAttribute('square-row-id'))][parseInt(square.getAttribute('square-col-id'))].color === color) {
      // tableData[parseInt(square.getAttribute('square-row-id'))][parseInt(square.getAttribute('square-col-id'))].isActive = false;
      const newRandomColor = colors[Math.floor(Math.random() * colors.length)];
      square.style.backgroundColor = newRandomColor;
      tableData[parseInt(square.getAttribute('square-row-id'))][parseInt(square.getAttribute('square-col-id'))].color = newRandomColor;
    } else {
      // tableData[parseInt(square.getAttribute('square-row-id'))][parseInt(square.getAttribute('square-col-id'))].isActive = true;
      tableData[parseInt(square.getAttribute('square-row-id'))][parseInt(square.getAttribute('square-col-id'))].color = color;
      square.style.backgroundColor = color;
    }
    square.classList.toggle('active');
  }

  /**
   * Creates a random color pool
   * @param {number} numberOfColors the length of the color pool
   * @return {string[]} the string array with random HEX colors
   */
  function getRandomColors(numberOfColors) {
    const letters = '0123456789ABCDEF';
    let colors = [];
    for (let i = 0; i < numberOfColors; i++) {
      let color = '#';
      for (let j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color);
    }
    return colors;
  }

  // #endregion

  createTable();
});
