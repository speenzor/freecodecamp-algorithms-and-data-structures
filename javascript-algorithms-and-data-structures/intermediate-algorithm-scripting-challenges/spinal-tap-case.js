//My solution to the FreeCodeCamp Intermediate Algorithm Scripting challenged Spinal Tap Case

function spinalCase(str) {
  let strings = str.match(/[a-zA-Z]+?(?=[A-Z])|[A-Z][a-z]+|[a-z]+/g);
  let result = strings.join('-').toLowerCase();
  return result;
}

spinalCase('This Is Spinal Tap');
