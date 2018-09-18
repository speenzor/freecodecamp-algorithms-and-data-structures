//My solution to FreeCodeCamp's Intermediate Algorithm Scripting challenge Make A Person.
//Fill in the object constructor with the following methods below:
//getFirstName() getLastName() getFullName() setFirstName(first) setLastName(last) setFullName(firstAndLast)
//Run the tests to see the expected output for each method.
//The methods that take an argument must accept only one argument and it has to be a string.
//These methods must be the only available means of interacting with the object.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/make-a-person

var Person = function(firstAndLast) {
  let fullName = firstAndLast;
  this.getFirstName = function() {
    return fullName.split(' ')[0];
  }
  this.getLastName = function() {
    return fullName.split(' ')[1];
  }
  this.getFullName = function() {
    return fullName;
  }
  this.setFirstName = function(first) {
    fullName = [first].concat(fullName.split(' ')[1]).join(' ');
  }
  this.setLastName = function(last) {
    fullName = fullName.split(' ')[0] + ' ' + last;
  }
  this.setFullName = function(firstAndLast) {
    fullName = firstAndLast;
  }
};

//Sample tests
var bob = new Person('Bob Ross');
bob.getFullName();
