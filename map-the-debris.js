//My solution to FreeCodeCamp's Intermediate Algorithm Scriptin challenge Map The Debris.
//Return a new array that transforms the elements' average altitude into their orbital periods (in seconds).
//The array will contain objects in the format {name: 'name', avgAlt: avgAlt}.
//You can read about orbital periods on Wikipedia.
//The values should be rounded to the nearest whole number. The body being orbited is Earth.
//The radius of the earth is 6367.4447 kilometers, and the GM value of earth is 398600.4418 km3s-2.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/map-the-debris


function orbitalPeriod(arr) {
  const GM = 398600.4418;
  const earthRadius = 6367.4447;
  arr.map(function(x) {
    x.orbitalPeriod = Math.round(2*Math.PI*Math.sqrt((Math.pow(x.avgAlt+earthRadius, 3))/GM));
    delete x.avgAlt;
  });
  return arr;
}


//Sample test
orbitalPeriod([{name : "sputnik", avgAlt : 35873.5553}]);
