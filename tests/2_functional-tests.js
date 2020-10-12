/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Solver;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require('../public/sudoku-solver.js');
  });
  
  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {
      const testCell = document.querySelector('#A1');
      const textArea = document.querySelector('#text-input');
      const inputE = document.createEvent('UIEvent');
            inputE.initEvent('input', true, true)

      textArea.value = '.................................................................................';
      //document.querySelector('#text-input').dispatchEvent(inputE);
      //JSDOM not firing events properly this way, will call handler
      //manually instead.
      Solver.handleTextChange({target: textArea, currentTarget: textArea});
      assert.equal(testCell.value, '');

      textArea.value = '1................................................................................';
      Solver.handleTextChange({target: textArea, currentTarget: textArea});
      assert.equal(testCell.value, '1');

      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {
      const testCell = document.querySelector('#A1');
      const textArea = document.querySelector('#text-input');
      const inputE = document.createEvent('UIEvent');
            inputE.initEvent('input', true, true)

      testCell.value = '';
      Solver.handleTextChange({target: testCell, currentTarget: document.querySelector('#sudoku-grid')});
      assert.equal(textArea.value, '.................................................................................');

      testCell.value = '1';
      Solver.handleTextChange({target: testCell, currentTarget: document.querySelector('#sudoku-grid')});
      assert.equal(textArea.value, '1................................................................................');

      done();
    });
  });
  
  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku 
    // grid and the text area
    test('Function clearText()', done => {
      const testCell = document.querySelector('#A1');
      const textArea = document.querySelector('#text-input');

      //calling clicked clear button manually
      Solver.clearText();
      assert.equal(testCell.value,'')
      assert.equal(textArea.value,'')
      done();
    });
    
    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function main(input))', done => {
      const gridCells = document.querySelectorAll('.sudoku-input');
      const textArea = document.querySelector('#text-input');

      textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

      //calling clicked solve button manually
      Solver.main({});
      assert.equal(textArea.value,'769235418851496372432178956174569283395842761628713549283657194516924837947381625')
      for(let i=0;i<gridCells.length;i++){
        assert.equal(gridCells[i].value, textArea.value[i]);
      }
      done();
    });
  });
});

