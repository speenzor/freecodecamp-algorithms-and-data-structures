//My solution to FreeCodeCamp's Intermediate Algorithm Scripting challenge Sorted Union.
//Write a function that takes two or more arrays and returns a new array of unique values in the order of the original provided arrays.
//In other words, all values present from all arrays should be included in their original order, but with no duplicates in the final array.
//The unique numbers should be sorted by their original order, but the final array should not be sorted in numerical order.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/sorted-union

function uniteUnique(arr) {
  let result = [];
  for (let prop in arguments) {
    arguments[prop].forEach(function(num) {
      if (result.indexOf(num) === -1) {
        result.push(num);
      }
    });
  }
  return result;
}


//Sample test
uniteUnique([1, 3, 2], [5, 2, 1, 4], [2, 1]);
