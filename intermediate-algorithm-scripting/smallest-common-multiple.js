//This is a solution to the Smallest Common Multiple challenge. The only problem is that the FreeCodeCamp
//engine will not accept this answer because it takes too long to solve the last test case of [23, 18].
//But this code will solve this test case in other editors and it does work.

function smallestCommons(arr) {
  let fullArr = [];
  let larger;
  if (arr[0] < arr[1]) {
    larger = arr[1];
    for (let x = arr[0]; x <= arr[1]; x++) {
      fullArr.push(x);
    }
  } else {
    larger = arr[0];
    for (let x = arr[1]; x <= arr[0]; x++) {
      fullArr.push(x);
    }
  }
  for (let i = larger; i < 7000000; i++) {
   if (fullArr.every(function(num) {
     if (i % num === 0) {return true;} else {return false;}
     })) {
      return i;
    }
  }
}
