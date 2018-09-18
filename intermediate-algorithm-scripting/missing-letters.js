//My solution to FreeCodeCamp's Intermediate Algorithm Scripting challenge Missing Letters.
//Find the missing letter in the passed letter range and return it.
//If all letters are present in the range, return undefined.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/missing-letters


function fearNotLetter(str) {
  let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  for (let i = alphabet.indexOf(str[0]); i < alphabet.indexOf(str[0]) + str.length; i++) {
    if (str[i - alphabet.indexOf(str[0])] !== alphabet[i]) {
    return alphabet[i];
    }
  }
  return undefined;
}

//Sample test
fearNotLetter("abce");
