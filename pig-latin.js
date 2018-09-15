//My solution to the FreeCodeCamp Intermediate Algorithm Scripting challenge called Pig Latin.
//Translate the provided string to pig latin.
//Pig Latin takes the first consonant (or consonant cluster) of an English word, moves it to the end of the word and suffixes an "ay".
//If a word begins with a vowel you just add "way" to the end.
//Input strings are guaranteed to be English words in all lowercase.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/pig-latin

function translatePigLatin(str) {
  let regex = /^[^aeiou]+(?=[aeiou])/;
  let vowelregex = /[aeiou]/g;
  let result1;
  let result2;
  if (!vowelregex.test(str)) {
    return str + 'ay';
  } else if (regex.test(str)) {
    result1 = str.replace(regex, '');
    result2 = result1 + str.match(regex) + 'ay';
  } else {
    result2 = str + 'way';
  }
  return result2;
}

//Sample test
translatePigLatin("consonant");
