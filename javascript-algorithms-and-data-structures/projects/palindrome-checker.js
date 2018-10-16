//This is my solution to the JavaScript Algorithms and Data Structures Projects: Palindrome Checker
//Return true if the given string is a palindrome. Otherwise, return false.
//A palindrome is a word or sentence that's spelled the same way both forward and backward, ignoring punctuation, case, and spacing.
//You'll need to remove all non-alphanumeric characters (punctuation, spaces and symbols) and turn everything into the same case (lower or upper case) in order to check for palindromes.
//We'll pass strings with varying formats, such as "racecar", "RaceCar", and "race CAR" among others.
//We'll also pass strings with special symbols, such as "2A3*3a2", "2A3 3a2", and "2_A3*3#A2".
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/palindrome-checker/


function palindrome(str) {
  let testStr = str.toLowerCase().replace(/[\s\W_]/g,'');
  for (let i=0, x=testStr.length-1; i<testStr.length; i++, x--) {
    if (testStr[i] !== testStr[x]) {
      return false;
    }
  }
  return true;
}

//Sample test
palindrome("eye");
