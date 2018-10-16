//This is a solution to the FreeCodeCamp Intermediate Algorithm Scripting challenged called Sum All Odd Fibocacci Numbers.
//This solution is not my original solution. I couldn't figute out how to elegantly add together Fibonacci numbers below
//the input number. I had originally created two functions within the sumFibs function. One would check if the given
//Fibonacci number was both an odd number and was below the maximum number. Then I defined a Fibonacci function that would
//return all the Fibonacci number given number in the Fibonacci sequence. This would have been difficult to tie together,
//it would have been extremely slow, and it would not have had a way to stop making expensive function calls without
//first checking the next number to see if it was below the max number allowed. So the solution below was a learning
//solution more than anything.

function sumFibs(num) {
  let result = 0;
  let prevNum = 0;
  let currNum = 1;
  
  while(currNum <= num) {
    if (currNum % 2 !== 0) {
      result += currNum;
    }

    currNum += prevNum;
    prevNum = currNum - prevNum;
  }
  
  return result;
}
