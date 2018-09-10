//My solution to FreeCodeCamp's Intermediate Algorithm Scripting challenge Diff Two Arrays.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/diff-two-arrays

function diffArray(arr1, arr2) {
  var newArr = [];
  return newArr.concat(arr1.filter((x) => arr2.indexOf(x) === -1)).concat(arr2.filter((x) => arr1.indexOf(x) === -1));
}
