//My solution to the FreeCodeCamp Intermediate Algorithm Scripting challenge called Sum All Numbers In a Range.
//We'll pass you an array of two numbers. Return the sum of those two numbers plus the sum of all the numbers between them.
//The lowest number will not always come first.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/sum-all-numbers-in-a-range

function sumAll(arr) {
  let result = 0;
  if (arr[0] < arr[1]) {
    for (let i=arr[0]; i<=arr[1]; i++) {
      result += i;
    }
  } else {
    for (let i=arr[1]; i<=arr[0]; i++) {
      result += i;
    }
  }
  return result;
}

//Sample test
sumAll([1, 4]);
