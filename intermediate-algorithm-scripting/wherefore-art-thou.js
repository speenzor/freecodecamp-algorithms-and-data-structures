//My solution to FreeCodeCamp Intermediate Algorithm Scripting challenge Wherefore Art Thou
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/wherefore-art-thou

function whatIsInAName(collection, source) {
  var arr = [];
  if (Object.keys(source).length === 1) {
    for (let i=0; i<Object.keys(source).length; i++) {
      arr = arr.concat(collection.filter(x => x.hasOwnProperty(Object.getOwnPropertyNames(source)[i]) && x[Object.getOwnPropertyNames(source)[i]] === source[Object.getOwnPropertyNames(source)[i]]));
    }
  } else {
    for (let i=0; i<Object.keys(source).length; i++) {
      arr = arr.concat(collection.filter(x => x.hasOwnProperty(Object.getOwnPropertyNames(source)[i]) && x[Object.getOwnPropertyNames(source)[i]] === source[Object.getOwnPropertyNames(source)[i]] && x.hasOwnProperty(Object.getOwnPropertyNames(source)[i+1]) && x[Object.getOwnPropertyNames(source)[i+1]] === source[Object.getOwnPropertyNames(source)[i+1]]));
    }
  }
  return arr;
}
