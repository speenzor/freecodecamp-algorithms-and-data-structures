//My solution to the FreeCodeCamp Intermediate Algorithm Scripting problem Convert HTML Entities
//This function converts the characters &, <, >, " (double quote), and ' (apostrophe), in a string to their corresponding HTML entities.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/convert-html-entities

function convertHTML(str) {
  let newStr = str.replace(/&/g, '&amp;');
  newStr = newStr.replace(/</g, '&lt;');
  newStr = newStr.replace(/>/g, '&gt;');
  newStr = newStr.replace(/\"/g, '&quot;');
  newStr = newStr.replace(/'/g, '&apos;');
  return newStr;
}
