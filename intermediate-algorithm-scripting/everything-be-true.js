//My solution to FreeCodeCamp's Intermediate Algorithm Scripting challenge Everything Be True.
//Check if the predicate (second argument) is truthy on all elements of a collection (first argument).
//In other words, you are given an array collection of objects. The predicate pre will be an object property
//and you need to return true if its value is truthy. Otherwise, return false.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/everything-be-true

function truthCheck(collection, pre) {
  let result = true;
  collection.forEach(function(object) {
    if (!object[pre]) {
      result = false;
    }
  });
  return result;
}

truthCheck([{"user": "Tinky-Winky", "sex": "male"}, {"user": "Dipsy", "sex": "male"}, {"user": "Laa-Laa", "sex": "female"}, {"user": "Po", "sex": "female"}], "sex");
