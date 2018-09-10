//My solution to the FreeCodeCamp Intermediate Algorithm Scripting challenge called Arguments Optional.

function addTogether() {
  if (arguments.length === 2) {
    if (typeof arguments[0] !== 'number' || typeof arguments[1] !== 'number') {
      return undefined;
    } else {
      return arguments[0] + arguments[1];
    }
  }
  if (arguments.length === 1) {
    if (typeof arguments[0] !== 'number') {
      return undefined;
    } else {
      let arg1 = arguments[0];
      return function(arg2) {
        if (typeof arg2 !== 'number') {
          return undefined;
        } else {
          return arg1 + arg2;
        }
      }
    }
  }
}
