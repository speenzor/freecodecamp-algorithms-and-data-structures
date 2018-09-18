//My solution to FreeCodeCamp's Intermediate Algorithm Scripting challenge Drop It.
//Given the array arr, iterate through and remove each element starting from the first element (the 0 index) until
//the function func returns true when the iterated element is passed through it.
//Then return the rest of the array once the condition is satisfied, otherwise, arr should be returned as an empty array.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/drop-it

function dropElements(arr, func) {
  for (let i = 0; i < arr.length; i++) {
    if (func(arr[i])) {
      return arr.slice(i);}
    }
  return [];
}


//Sample test case
dropElements([1, 2, 3], function(n) {return n < 3; });
