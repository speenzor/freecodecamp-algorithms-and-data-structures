//This is my solution to the JavaScript Algorithms and Data Structures Projects: Cash Register
//Design a cash register drawer function checkCashRegister() that accepts purchase price as the first argument (price),
//payment as the second argument (cash), and cash-in-drawer (cid) as the third argument.
//cid is a 2D array listing available currency.
//The checkCashRegister() function should always return an object with a status key and a change key.
//Return {status: "INSUFFICIENT_FUNDS", change: []} if cash-in-drawer is less than the change due, or if you cannot return the exact change.
//Return {status: "CLOSED", change: [...]} with cash-in-drawer as the value for the key change if it is equal to the change due.
//Otherwise, return {status: "OPEN", change: [...]}, with the change due in coins and bills, sorted in highest to lowest order, as the value of the change key.
//https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/cash-register

//This was a very fun and challenging problem. It took me literally an entire Saturday to finish and many interations on the solution.

function checkCashRegister(price, cash, cid) {
  //Setup variable to be used later. The names describe what they are being used for
  let result = {status: '', change: []};
  let neededChange = cash - price;
  let changeArr = [];
  //Used later to loop through the neededChange variable
  let loopLogic = true;
  //This will be used to keep track of much change is left after each iteration
  let cidObj = {"100": cid[8][1], "20": cid[7][1], "10": cid[6][1], "5": cid[5][1], "1": cid[4][1], "0.25": cid[3][1], "0.10": cid[2][1], "0.05": cid[1][1], "0.01": cid[0][1]};
  //This will be used to keep track of what change has been used so far and will be part of our solution
  let changeObj = {"100": 0, "20": 0, "10": 0, "5": 0, "1": 0, "0.25": 0, "0.10": 0, "0.05": 0, "0.01": 0};
  //This function will be looped through many times in order to select the largest bills available for use as change before going
  //to the next largest bill/coin. Each time the function recognizes the ability to issue change it will update the change-in-drawer
  //that's still available for use, update the change given out so far, and reduce the amount of total change that still needs to
  //be solved for.
  let func = function() {
    if (neededChange/100 >= 1 && cidObj[100] > 0) {
      neededChange -= 100;
      cidObj[100] -= 100;
      changeObj[100] += 100;
    } else if (neededChange/20 >= 1 && cidObj[20] > 0) {
      neededChange -= 20;
      cidObj[20] -= 20;
      changeObj[20] += 20;
    } else if (neededChange/10 >= 1 && cidObj[10] > 0) {
      neededChange -= 10;
      cidObj[10] -= 10;
      changeObj[10] += 10;
    } else if (neededChange/5 >= 1 && cidObj[5] > 0) {
      neededChange -= 5;
      cidObj[5] -= 5;
      changeObj[5] += 5;
    } else if (neededChange/1 >= 1 && cidObj[1] > 0) {
      neededChange -= 1;
      cidObj[1] -= 1;
      changeObj[1] += 1;
    } else if (neededChange/0.25 >= 1 && cidObj[0.25] > 0) {
      neededChange -= 0.25;
      cidObj[0.25] -= 0.25;
      changeObj[0.25] += 0.25;
    //Very strangely, JavaScript doesn't seem to be able to use "0.10" to lookup an object's value unless it's in quotations
    } else if (neededChange/0.10 >= 1 && cidObj['0.10'] > 0) {
      neededChange = Math.round(neededChange*100)/100 - 0.10;
      cidObj['0.10'] -= 0.10;
      changeObj['0.10'] += 0.10;
    } else if (neededChange/0.05 >= 1 && cidObj[0.05] > 0) {
      neededChange -= 0.05;
      cidObj[0.05] -= 0.05;
      changeObj[0.05] += 0.05;
    } else if (neededChange/0.01 >= 1 && cidObj[0.01] > 0) {
      neededChange = Math.round(neededChange*100)/100 - 0.01;
      cidObj[0.01] -= 0.01;
      changeObj[0.01] += 0.01;
    } else {
      //Once there's no change needed or there's no change left to be given out it will break the loop
      loopLogic = false;
    }
  }

  //Loop through the function above how ever many times is necessary to exhaust change available or to fulfill the needed change
  while (loopLogic) {
    func();
  }

  //The func function has updated three variables that are now used to produce the final solution Object
  if (neededChange === 0 && Object.values(cidObj).filter(x => x > 0).length === 0) {
    //If all the change was given out of the draw and satisfied the neededChange then the change drawer is closed and
    //the result will be equal to the input cid array
    result.status = "CLOSED";
    result.change = cid;
  } else if (neededChange === 0) {
    //If the needed change was satisfied by the change in the drawer then we create the final array of change that was given out
    //using the changeArr object that was being updated by the func function with the change given out
    if (changeObj[100] > 0) {
      changeArr.push(["ONE HUNDRED", changeObj[100]]);
    }
    if (changeObj[20] > 0) {
      changeArr.push(["TWENTY", changeObj[20]]);
    }
    if (changeObj[10] > 0) {
      changeArr.push(["TEN", changeObj[10]]);
    }
    if (changeObj[5] > 0) {
      changeArr.push(["FIVE", changeObj[5]]);
    }
    if (changeObj[1] > 0) {
      changeArr.push(["ONE", changeObj[1]]);
    }
    if (changeObj[0.25] > 0) {
      changeArr.push(["QUARTER", changeObj[0.25]]);
    }
    //Very strangely, JavaScript doesn't seem to be able to use "0.10" to lookup an object's value unless it's in quotations
    if (changeObj['0.10'] > 0) {
      changeArr.push(["DIME", changeObj['0.10']]);
    }
    if (changeObj[0.05] > 0) {
      changeArr.push(["NICKEL", changeObj[0.05]]);
    }
    if (changeObj[0.01] > 0) {
      changeArr.push(["PENNY", changeObj[0.01]]);
    }
    result.status = "OPEN";
    result.change = changeArr;
  } else {
    //If there the neededChange variable is not 0 then there wasn't enough change to meet the need
    result.status = "INSUFFICIENT_FUNDS";
  }

  return result;
}

// Sample cid array input:
// [["PENNY", 1.01],
// ["NICKEL", 2.05],
// ["DIME", 3.1],
// ["QUARTER", 4.25],
// ["ONE", 90],
// ["FIVE", 55],
// ["TEN", 20],
// ["TWENTY", 60],
// ["ONE HUNDRED", 100]]

//Sample test:
checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])
