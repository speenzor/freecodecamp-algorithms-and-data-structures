//My solution to the FreeCodeCamp Intermediate Algorithm Scripting challenge called Seek and Destroy.
//You will be provided with an initial array (the first argument in the destroyer function), followed by one or more arguments.
//Remove all elements from the initial array that are of the same value as these arguments.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/seek-and-destroy

function destroyer(arr) {
  let result = [];
  let testarr = [];
  for (let i=1; i<arguments.length; i++) {
    testarr.push(arguments[i]);
  }
  arguments[0].forEach(function(element) {
    if (testarr.indexOf(element) === -1) {
      result.push(element);
    }
  })
  return result;
}

//Sample test
destroyer([1, 2, 3, 1, 2, 3], 2, 3);
