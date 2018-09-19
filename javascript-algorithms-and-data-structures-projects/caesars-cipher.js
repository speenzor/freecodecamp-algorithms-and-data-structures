//This is my solution to the JavaScript Algorithms and Data Structures Projects: Caesars Cipher

//One of the simplest and most widely known ciphers is a Caesar cipher, also known as a shift cipher.
//In a shift cipher the meanings of the letters are shifted by some set amount.
//A common modern use is the ROT13 cipher, where the values of the letters are shifted by 13 places.
//Thus 'A' ↔ 'N', 'B' ↔ 'O' and so on.
//Write a function which takes a ROT13 encoded string as input and returns a decoded string.
//All letters will be uppercase. Do not transform any non-alphabetic character (i.e. spaces, punctuation), but do pass them on.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/caesars-cipher/


function rot13(str) {
  //Define new function that will be used to shift only letters
  let shift = function(x) {
    let alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    return alphabet[alphabet.indexOf(x) + 13];
  }
  //Define the result variable that will modified and returned
  let result = '';
  //Loop through each character in the given string. Test if it is a letter
  for (let i=0; i<str.length; i++) {
    //If it's a letter then run it through the shift fuction defined about
    if (/[a-zA-Z]/.test(str[i])) {
      result += shift(str[i]);
    } else {
      //If not a letter than just keep it as is
      result += str[i];
    }
  }
  return result;
}

// Change the inputs below to test
rot13("LBH QVQ VG!");
