//My solution to the FreeCodeCamp Intermediate Algorithm Scripting challenge Binary Agents
//This converts a string of space-separated binary numbers into a string
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/binary-agents

function binaryAgent(str) {
  return str.split(' ').map(x => String.fromCharCode(parseInt(x, 2).toString(10))).join('');
}
