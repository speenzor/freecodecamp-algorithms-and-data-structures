//My solution to the FreeCodeCamp Intermediate Algorithm Scripting challenge called Search and Replace.
//Perform a search and replace on the sentence using the arguments provided and return the new sentence.
//First argument is the sentence to perform the search and replace on.
//Second argument is the word that you will be replacing (before).
//Third argument is what you will be replacing the second argument with (after).
//Preserve the case of the first character in the original word when you are replacing it.
//For example if you mean to replace the word "Book" with the word "dog", it should be replaced as "Dog"
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/search-and-replace/

function myReplace(str, before, after) {
  let array = str.split(' ');
  let beginning = array.indexOf(before);
  let beforeArray = before.split('');
  let newAfter;
  let finalAfter;
  if (before[0] === before[0].toUpperCase()) {
    newAfter = after.split('');
    finalAfter = newAfter[0].toUpperCase() + newAfter.slice(1).join('');
  } else {
    finalAfter = after;
  }
  array.splice(beginning, 1, finalAfter);
  return array.join(' ');
}

//Sample test.
myReplace("A quick brown fox jumped over the lazy dog", "jumped", "leaped");
