//My solution to FreeCodeCamp's Intermediate Algorithm Scripting challenge Sum All Primes.
//Sum all the prime numbers up to and including the provided number.
//A prime number is defined as a number greater than one and having only two divisors, one and itself.
//For example, 2 is a prime number because it's only divisible by one and two.
//The provided number may not be a prime.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/intermediate-algorithm-scripting/sum-all-primes


function isPrime(num) {
  for (let i = 2; i < num; i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return num !== 1;
}

function sumPrimes(num) {
  let result = 0;
  if (num === 1) {
    return 0;
  }
  for (let i = 2; i < num+1; i++) {
    if (isPrime(i)) {
      result += i;
    }
  }
  return result;
}

//Sample test
sumPrimes(10);
