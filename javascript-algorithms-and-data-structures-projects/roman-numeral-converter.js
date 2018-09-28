//This is my solution to the JavaScript Algorithms and Data Structures Projects: Roman Numeral Converter
//Convert the given number into a roman numeral.
//All roman numerals answers should be provided in upper-case.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/roman-numeral-converter/

function convertToRoman(num) {
    let newNum = num;
    let result = '';
    let romanNumeral = function(num) {
        if (num >= 1000) {
            result += 'M';
            newNum -= 1000;
        } else if (num >= 900) {
            result += 'CM';
            newNum -= 900;
        } else if (num >= 500) {
            result += 'D';
            newNum -= 500;
        } else if (num >= 400) {
            result += 'CD';
            newNum -= 400;
        } else if (num >= 100) {
            result += 'C';
            newNum -= 100;
        } else if (num >= 90) {
            result += 'XC';
            newNum -= 90;
        } else if (num >= 50) {
            result += 'L';
            newNum -= 50;
        } else if (num >= 40) {
            result += 'XL';
            newNum -= 40;
        } else if (num >= 10) {
            result += 'X';
            newNum -= 10;
        } else if (num >= 9) {
            result += 'IX';
            newNum -= 9;
        } else if (num >= 8) {
            result += 'VIII';
            newNum -= 8;
        } else if (num >= 7) {
            result += 'VII';
            newNum -= 7;
        } else if (num >= 6) {
            result += 'VI';
            newNum -= 6;
        } else if (num >= 5) {
            result += 'V';
            newNum -= 5;
        } else if (num >= 4) {
            result += 'IV';
            newNum -= 4;
        } else if (num >= 3) {
            result += 'III';
            newNum -= 3;
        } else if (num >= 2) {
            result += 'II';
            newNum -= 2;
        } else if (num >= 1) {
            result += 'I';
            newNum -= 1;
        }
    }
    while (newNum > 0) {
        romanNumeral(newNum);
    }
    return result;
}

//Sample test
convertToRoman(36);
