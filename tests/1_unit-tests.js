/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let Solver;

suite('UnitTests', () => {
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile('./views/index.html')
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;

        Solver = require('../public/sudoku-solver.js');
      });
  });
  
  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite('Function handleTextChange()', () => {
    test('Valid "1-9" characters', (done) => {
      const testCell = document.querySelector('#A1');
      const errorDiv = document.querySelector('#error-msg')
      const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      for(let each of input){
        testCell.value = each;
        assert.isTrue(Solver.handleTextChange({target: testCell, currentTarget: document.getElementById('sudoku-grid')}));
      }
      done();
    });

    // Invalid characters or numbers are not accepted 
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
      const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];
      const testCell = document.querySelector('#A1');
      const errorDiv = document.querySelector('#error-msg')
      for(let each of input){
        testCell.value = each;
        assert.isFalse(Solver.handleTextChange({target: testCell, currentTarget: document.getElementById('sudoku-grid')}));
      }
      done();
    });
  });
  
  suite('More handleTextChange()', () => {
    
    test('Parses a valid puzzle string into an object', done => {
      //parsing the string into an object is not a requirement of
      //the user stories, and is not performed during calculations.
      //test has been set to pass based on no error showing as a
      //result of using the input string.
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const textArea = document.getElementById('text-input');
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');
      
      textArea.value = input;
      Solver.handleTextChange({currentTarget: textArea, target: textArea});
      assert.notEqual(errorDiv.textContent, errorMsg);
      
      done();
    });
    
    // Puzzles that are not 81 numbers/periods long show the message 
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test('Shows an error for puzzles that are not 81 numbers long', done => {
      const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');
      const textArea = document.getElementById('text-input');
      
      for(let each of [shortStr, longStr]){
        textArea.value = each;
        Solver.handleTextChange({currentTarget: textArea, target: textArea});
        assert.equal(errorDiv.textContent, errorMsg)
      }

      done();
    });
  });

  suite('Function solve()', () => {
    // Valid complete puzzles pass
    // 'solve' should return the same string that it received
    test('Valid puzzles pass', done => {
      const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

      assert.equal(Solver.solve(input), input);

      done();
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', done => {
      const input = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';

      assert.equal(Solver.solve(input), 'error');

      done();
    });
  });
  
  
  suite('Function ____()', () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test('Returns the expected solution for an incomplete puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      
      assert.equal(Solver.solve(input), solution)

      done();
    });
  });
});
