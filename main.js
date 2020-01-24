var board = [];
var hash = {};
$(function() {
  var canvas = $('#canvasElement');
  var context = canvas.get(0).getContext('2d');
  var canvasWidth = canvas.width();
  var canvasHeight = canvas.height();


  pixelSetLen = canvasWidth * canvasHeight;
  for (i = 0; i < pixelSetLen; i++) {
    board[i] = rand(100, 150);
  }
  count = 1;
  total = 8;
  interation = 0;
  hash = addLive(hash, 0, rand(5, canvasWidth), rand(5, canvasHeight), 1);
  hash = addLive(hash, 1, rand(5, canvasWidth), rand(5, canvasHeight), 2);
  hash = addLive(hash, 2, rand(5, canvasWidth), rand(5, canvasHeight), 3);
  hash = addLive(hash, 3, rand(5, canvasWidth), rand(5, canvasHeight), 4);
  hash = addLive(hash, 4, rand(5, canvasWidth), rand(5, canvasHeight), 1);
  hash = addLive(hash, 5, rand(5, canvasWidth), rand(5, canvasHeight), 2);
  hash = addLive(hash, 6, rand(5, canvasWidth), rand(5, canvasHeight), 3);
  hash = addLive(hash, 7, rand(5, canvasWidth), rand(5, canvasHeight), 4);
  live(context, canvasWidth, canvasHeight, board, count, interation, total);
});

function addLive(hash, index, x, y, type) {
  maxHungry = rand(50, 100);
  hungry = rand(1, maxHungry);
  life = rand(maxHungry, maxHungry * 4);
  if (index < 4) {
    maxHungry = maxHungry * 3;
    hungry = hungry * 3;
    life = life * 3;
  }
  if (type == 1) {
    r = 255;
    g = 0;
    b = 0;
  } else if (type == 2) {
    r = 255;
    g = 220;
    b = 0;
  } else if (type == 3) {
    r = 0;
    g = 0;
    b = 255;
  } else if (type == 4) {
    r = 255;
    g = 0;
    b = 255;
  }
  hash[index] = {
    'x': x,
    'y': y,
    'hungry': hungry,
    'maxHungry': maxHungry,
    'eat': 0,
    'life': life,
    'r': r,
    'g': g,
    'b': b,
    'type': type
  };
  return hash;
}

function live(context, canvasWidth, canvasHeight, board, count, interation, total) {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  if (interation == 50) {
    interation = 0;
    pixelSetLen = canvasWidth * canvasHeight;
    for (i = 0; i < pixelSetLen; i++) {
      if (board[i] >= 1) {
        board[i] = board[i] - 1;
      }
    }
  }
  imageData = context.createImageData(canvasWidth, canvasHeight);

  var pixelSetLen = 4 * canvasWidth * canvasHeight;
  n = 0;
  for (i = 3; i < pixelSetLen; i += 4) {
    imageData.data[i - 3] = board[n];
    imageData.data[i - 2] = board[n];
    imageData.data[i - 1] = board[n];
    imageData.data[i] = 255;
    n++;
  }
  $.each(hash, function(index) {




    if (hash[index]['life'] > 0) {

      permissible = [];
      var n = 0;
      for (var i = hash[index]['x'] - 1; i <= (hash[index]['x'] + 1); i++) {
        for (var j = hash[index]['y'] - 1; j <= (hash[index]['y'] + 1); j++) {
          var emptyCeil = true;

          if (i > canvasWidth - 1) {
            emptyCeil = false;
          }
          if (j > canvasHeight - 1) {
            emptyCeil = false;
          }
          if (i < 0) {
            emptyCeil = false;
          }
          if (j < 0) {
            emptyCeil = false;
          }

          if (emptyCeil === true) {
            pos = (i + j * canvasWidth) * 4;
            if (imageData.data[pos] == imageData.data[pos + 1] && imageData.data[pos + 1] == imageData.data[pos + 2]) {

            } else {
              if (imageData.data[pos] != hash[index]['r'] || imageData.data[pos + 1] != hash[index]['g'] || imageData.data[pos + 2] != hash[index]['b']) {
                for (index2 in hash)
                  if (hash.hasOwnProperty(index2)) {
                    if (hash[index2]['x'] == i && hash[index2]['y'] == j) {
                      if (hash[index]['type'] != hash[index2]['type']) {
                        if ((hash[index]['life'] + hash[index]['hungry']) > (hash[index2]['life'] + hash[index2]['hungry'])) {
                          hash[index2]['r'] = hash[index]['r'];
                          hash[index2]['g'] = hash[index]['g'];
                          hash[index2]['b'] = hash[index]['b'];
                          hash[index2]['type'] = hash[index]['type'];
                        } else if ((hash[index]['life'] + hash[index]['hungry']) > (hash[index2]['life'] + hash[index2]['hungry'])) {
                          hash[index]['r'] = hash[index2]['r'];
                          hash[index]['g'] = hash[index2]['g'];
                          hash[index]['b'] = hash[index2]['b'];
                          hash[index]['type'] = hash[index2]['type'];
                        } else {
                          hash[index]['life'] = 1;
                          hash[index2]['life'] = 1;
                        }
                      }
                    }
                  }
              }
              emptyCeil = false;
            }
          }

          if (emptyCeil === true) {
            pos = (i + j * canvasWidth) * 4;
            permissible[n] = {
              'x': i,
              'y': j,
              'con': (imageData.data[pos] + imageData.data[pos + 1] + imageData.data[pos + 2])
            };
            n = n + 1;
          }
        }
      }

      n = permissible.length - 1;
      if (n > 0) {
        var np = 0;
        np = minelm(permissible);

        if (np == 0 && n > 1) {
          np = rand(0, n);
        }
        hash[index]['x'] = permissible[np]['x'];
        hash[index]['y'] = permissible[np]['y'];
      }

      if (hash[index]['eat'] == 0) {

        if (hash[index]['hungry'] <= (hash[index]['maxHungry'] / 2)) {
          hash[index]['eat'] = 1;
        }

        if (hash[index]['hungry'] > 0) {
          hash[index]['hungry'] = hash[index]['hungry'] - 1;
        }
      } else {
        var p = context.getImageData(hash[index]['x'], hash[index]['y'], 1, 1).data;
        arrpos = (hash[index]['y'] * (canvasWidth)) + (hash[index]['x']);
        if (board[arrpos] < 255) {
          board[arrpos] = board[arrpos] + 4;
          hash[index]['hungry'] = hash[index]['hungry'] + 2;

          if (hash[index]['hungry'] >= hash[index]['maxHungry']) {
            hash[index]['eat'] = 0;

            if (permissible.length > 1) {
              indx = rand(0, permissible.length - 1);
              if (total < 3000) {
                hash = addLive(hash, count, permissible[indx]['x'], permissible[indx]['y'], hash[index]['type']);
                total++;
                count++;
              }
            }
          }
        } else {
          hash[index]['eat'] = 0;
        }
      }
      hash[index]['life'] = hash[index]['life'] - 1;
      if (hash[index]['life'] <= 0) {
        arrpos = (hash[index]['y'] * (canvasWidth)) + (hash[index]['x']);
        board[arrpos] = board[arrpos] - hash[index]['life'];
        if (board[arrpos] < 0) {
          board[arrpos] = 0;
        }
      }
      setPixel(imageData, hash[index]['x'], hash[index]['y'], hash[index]['r'], hash[index]['g'], hash[index]['b'], 255);
    } else {
      total--;
      delete hash[index];
    }

  });
  context.putImageData(imageData, 0, 0);

  interation++;

  setTimeout(function() {
    live(context, canvasWidth, canvasHeight, board, count, interation, total);
  }, 13);
}

function setPixel(imageData, x, y, r, g, b, a) {
  index = (x + y * imageData.width) * 4;
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}

function rand(m, M) {
  return M ? m + rand(M - m) : Math.random() * ++m << .5
}

function maxIndex(arr) {
  var maxIndex = -1;
  for (var i = 0; i < maxIndex.length; i++) {
    maxIndex = i;
  }
  return maxIndex;
}

function minelm(v) {
  var m = v[0]['con'];
  var pos = 0;
  for (var i = 0; i <= v.length - 1; i++) {
    if (v[i]['con'] < m) {
      m = v[i]['con'];
      pos = i;
    }
  }
  return pos;
}


function arraySize(arr) {
  counter = 0;
  for (var i in arr)
    if (arr[i] != "") counter++;
  return counter;
}