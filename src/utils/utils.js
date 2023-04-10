function sortBy(attr, order) {
  return function (a, b) {
    a = a[attr]
    b = b[attr]
    if (a < b) {
      return order * -1
    }
    if (a > b) {
      return order * 1
    }
    return 0
  }
}

function matchType(type) {
  let result
  switch (type) {
    case 'news':
      result = true;
      break
    case 'paper':
      result = true;
      break
    case 'patent':
      result = true;
      break
    case 'all':
      result = true;
      break
    default:
      result = false;
      break
  }
  return result
}

function getRandomStr() {
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  var res = "";
  var n = 5;
  var timestamp = new Date().getTime();
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res + timestamp;
}


export {
  sortBy,
  matchType,
  getRandomStr
}
