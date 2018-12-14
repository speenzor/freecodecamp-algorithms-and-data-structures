/*
*
*
*       Complete the handler logic below
*       
*       
*/
const math = require('mathjs');

function ConvertHandler() {
  
  this.getNum = function(input) {
    let result = input.toString();
    if (!/\d/.test(result)) {
      result = '1' + result;
    };
    result = result.replace(/,/g, '');
    result = result.split(/[A-Za-z]/)[0];
    //This function turns a string input of an equation to a rounded number output
    const evaluate = (num) => Math.floor(Number(math.eval(num))*100000)/100000;
    if (result.match(/\//g) !== null) {
      if (result.match(/\//g).length >= 2 || isNaN(evaluate(result))) {
        return "invalid number";
      } else {
        return evaluate(result);
      }
    } else {
      if (isNaN(evaluate(result))) {
        return "invalid number";
      } else {
        return evaluate(result);
      }
    }
  };
  
  this.getUnit = function(input) {
    let result = input.toLowerCase();
    result = result.replace(/,/g, '');
    if (result.match(/[A-Za-z]+/) === null) {
      return "invalid unit";
    } else {
      result = result.match(/[A-Za-z]+/)[0];
    }
    const possibleUnits = ['gal', 'l', 'lbs', 'kg', 'mi', 'kg', 'km'];
    if (possibleUnits.includes(result)) {
      if (result === 'l') {
        return 'L';
      } else {
        return result;
      }
    } else {
      return "invalid unit";
    }
  };
  
  this.getReturnUnit = function(initUnit) {
    let result = initUnit.toLowerCase();
    switch(result) {
      case 'gal':
        result = 'L';
        break;
      case 'l':
        result = 'gal';
        break;
      case 'lbs':
        result = 'kg';
        break;
      case 'kg':
        result = 'lbs';
        break;
      case 'mi':
        result = 'km';
        break;
      case 'km':
        result = 'mi';
        break;
      default:
        result = "invalid unit";
    }
    return result;
  };

  this.spellOutUnit = function(unit) {
    let result = unit.toLowerCase();
    switch (result) {
      case 'gal':
        result = 'gallons';
        break;
      case 'l':
        result = 'liters';
        break;
      case 'lbs':
        result = 'pounds';
        break;
      case 'lb':
        result = 'pound';
        break;
      case 'kg':
        result = 'kilograms';
        break;
      case 'mi':
        result = 'miles';
        break;
      case 'km':
        result = 'kilometers';
        break;
      default:
        result = "invalid unit";
    }
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    switch(initUnit.toLowerCase()) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'l':
        result = initNum / galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      default:
        result = "invalid unit";
    }
    return Math.floor(result*100000)/100000;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
  
}

module.exports = ConvertHandler;
