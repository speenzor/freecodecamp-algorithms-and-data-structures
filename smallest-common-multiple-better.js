//This is my solution to the Smallest Common Multiple challenge.

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
  
  for (let i = (larger*(larger-1)), x = 1; x < 7000000; x++) {
   if (fullArr.every(function(num) {
     if (i*x % num === 0) {return true;} else {return false;}
     })) {
      return i*x;
    }
  }
}
