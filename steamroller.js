//My solution to FreeCodeCamp's Intermediate Algorithm Scripting challenge Steamroller.
//Flatten a nested array. You must account for varying levels of nesting.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/steamroller

function steamrollArray(arr) {
  let result = [];
  function flatten(x) {
    if (!Array.isArray(x)) {
      result.push(x);
      } else {
      for (let i in x) {
        flatten(x[i]);
      }
    }
  };
  arr.forEach(flatten);
  return result;
}


//Sample test
steamrollArray([1, [2], [3, [[4]]]]);
