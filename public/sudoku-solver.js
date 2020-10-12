const textArea = document.getElementById('text-input');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load a puzzle into the text area
  textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  handleTextChange({currentTarget: textArea, target: textArea});

  document.querySelector('#solve-button').addEventListener('click', main);
  textArea.addEventListener('input', handleTextChange);
  document.querySelector('#clear-button').addEventListener('click', clearText);
  document.querySelector('#sudoku-grid').addEventListener('change', handleTextChange);
});

function clearText (event) {
  textArea.value = '.................................................................................';
  handleTextChange({currentTarget: textArea, target: textArea});
  textArea.value = '';
}

function handleTextChange(event){
  let target = event.currentTarget;
  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  if(textArea.value.match(/[^1-9\.]/) || 
     (event.target.value.match(/[^1-9]/) && event.target.className === 'sudoku-input')){
    document.querySelector('#error-msg').textContent = 'Error: Invalid character entered';
    return false;
  }
  else if (target.id === 'text-input'){
    //change grid from string
    document.querySelector('#error-msg').textContent = '';    
    if(target.value.length === 81){
      for(let i=0;i<81;i++){
        let cellId = `#${LETTERS[Math.floor(i/9)]}${i%9+1}`;
        let newVal = target.value[i]==='.'?'':target.value[i];
        document.querySelector(cellId).value = newVal;
        document.querySelector('#error-msg').textContent = '';
      }
      return true;
    } else if(textArea.value.length !== 81){
      document.querySelector('#error-msg').textContent = 'Error: Expected puzzle to be 81 characters long.';
      return false;
    }
  
  }
  else if(target.id === 'sudoku-grid'){
    //change string from grid
    document.querySelector('#error-msg').textContent = '';    
    let cellId = event.target.id;
    let strPos = LETTERS.indexOf(cellId[0])*9;
        strPos += Number(cellId[1]) - 1;
    let newVal = document.getElementById(cellId).value;
        newVal = newVal===''?'.':newVal;
    let strArr = textArea.value.split('');

    //if updating but string is not correct length, fix length
    //and update all values from grid in case of possible
    //user error with the string
    if(strArr.length !== 81){
      let gridCells = document.getElementsByClassName('sudoku-input');
      for(let i=strArr.length;strArr.length<81;i++){
        strArr.push('.');}
      for(let i=0;i<gridCells.length;i++){
        let currCellId = gridCells[i].id;
        strPos = LETTERS.indexOf(currCellId[0])*9;
        strPos += Number(currCellId[1]) - 1;
        strArr[strPos] = gridCells[i].value?gridCells[i].value:'.';
      }
    }      
    else strArr[strPos] = newVal;
    
    textArea.value = strArr.join('');
    return true;
  }
}

function main(event){
  if(textArea.value.length !== 81){
    document.querySelector('#error-msg').textContent = 'Error: Expected puzzle to be 81 characters long.'
  }
  else if(textArea.value.length === 81){
    let answer = solve(textArea.value);
    if(answer !== undefined){
      //for returned answers, display appropriate message
      if (textArea.value === answer){
        document.querySelector('#error-msg').textContent = 'Valid Solution!';
      }
      else if (answer === 'error'){
        document.querySelector('#error-msg').textContent = 'Error: Invalid Solution.';
      }
      else {
        textArea.value = answer;
        handleTextChange({currentTarget: textArea, target: textArea});
      }
    }
    else {
      document.querySelector('#error-msg').textContent = 'Error: Could not find solution.'
    }
  }
}

function solve(puzzle) {
  let puzStr = puzzle,
    puzArr = puzStr.split('');

  //if a completed string is submitted, verify it's a correct
  //solution
  if (!puzStr.includes('.')) {
    console.log(puzArr);
    if (puzArr.every((val, ind) => {
          return checkCol(val, ind, puzStr) &&
                 checkRow(val, ind, puzStr) &&
                 checkSquare(val, ind, puzStr);
        })){
      return puzStr;
    }
    else {
      return 'error';
    }
  }
  let blankPos = puzStr.indexOf('.');

  //recursively call itself to solve the puzzle using backtracking
  for (let i = 1; i < 10; i++) {
    puzArr[blankPos] = i;
    puzStr = puzArr.join('');
    if (checkCol(i, blankPos, puzStr) &&
      checkRow(i, blankPos, puzStr) &&
      checkSquare(i, blankPos, puzStr)) {
      let solution = solve(puzStr);
      if (solution) return solution;
    }
  }
}

function checkCol(num, pos, puzzle) {
  let col = pos % 9;
  for (let row = 0; row < 9; row++) {
    if (puzzle[col + 9 * row] === num.toString() && col + 9 * row !== pos) return false;
  }
  return true;
}

function checkRow(num, pos, puzzle) {
  let row = Math.floor(pos / 9);
  for (let col = 0; col < 9; col++) {
    if (puzzle[col + 9 * row] === num.toString() && col + 9 * row !== pos) return false;
  }
  return true;
}

function checkSquare(num, pos, puzzle) {
  //find the start of the square
  let x = (pos % 9) - ((pos % 9) % 3),
    y = Math.floor(pos / 9) - (Math.floor(pos / 9) % 3),
    start = x + (y * 9);

  for (let checkPos = 0; checkPos < 9; checkPos++) {
    // 'actual' pos being the current pos in original string
    let actualPos = start + (checkPos % 3) + (Math.floor(checkPos / 3) * 9);
    if (puzzle[actualPos] === num.toString() && actualPos !== pos) return false
  }
  return true;
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    solve: solve,
    checkCol: checkCol,
    checkRow: checkRow,
    checkSquare: checkSquare,
    main: main,
    clearText: clearText,
    handleTextChange: handleTextChange
  }
} catch (e) { }
