//My solution to the FreeCodeCamp Intermediate Algorithm Scriping problem DNA Pairing
//The DNA strand is missing the pairing element. Take each character, get its pair, and return the results as a 2d array.
//Base pairs are a pair of AT and CG. Match the missing element to the provided character.
//Return the provided character as the first element in each array.
//For example, for the input GCG, return [["G", "C"], ["C","G"],["G", "C"]]
//The character and its pair are paired up in an array, and all the arrays are grouped into one encapsulating array.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/dna-pairing

function pairElement(str) {
  let array1 = str.split('');
  let result = [];
  array1.forEach(function(x) {
    let smallArr = [];
    smallArr.push(x);
    if (x === 'A') {
      smallArr.push('T');
    } else if (x === 'T') {
      smallArr.push('A');
    } else if (x === 'C') {
      smallArr.push('G');
    } else {
      smallArr.push('C');
    }
    return result.push(smallArr);
  });
  return result;
}
