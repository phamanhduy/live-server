

let showWord = false;
let runningTime = false;
let timerRuning;

let showImgeInval;
let showImgeInvalLastWinner;
// Lấy các phần tử DOM
const imageContainer = document.querySelector('.image-container');

// function ramdomNumberArr(number = 10) {
//   let arrayCoin = [];
//   for (let i = 0; i <= number; i++) {
//     arrayCoin.push(Math.floor(Math.random() * number) + 1);
//   }
//   return arrayCoin;
// }


function randomArr(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function showPlayHtml(game) {
  const wordArr = game.word.split('');
  let html = '';
  for (let i = 0; i < wordArr.length; i++) {
    const elm = wordArr[i];
    if (elm === ' ') {
      html += `<div class='space'></div>`;
    } else {
      html += `<div class='square'>${showWord ? elm : ''}</div>`;
    }
  }
  document.getElementById('container-words').innerHTML = html;
}

function startRunTimer(duration) {
  var display = $('#timer-countdown');
  let totalSeconds = duration;
  timerRuning = setInterval(function() {
    let minutes = parseInt(Math.floor(totalSeconds / 60), 10);
    let seconds = parseInt(totalSeconds % 60, 10);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    if (totalSeconds >= 0) {
      display.text(minutes + ':' + seconds);
    }
    // Replace with your own code to update the countdown display
    if (totalSeconds === duration) {
      // runChungMung();
    }

    if (totalSeconds === 0) {
      ramdomNumberLastWinner(() => {
        runGift(() => {
          totalSeconds = duration;
        });
      });
    }
    totalSeconds--;
  }, 1000);
}



function runGift(cb, option = { timer: 15000}) {
  adProductrunGift(true);
  runningTime = true;
  setTimeout(() => {
    cb();
    adProductrunGift(false);
  }, option.timer);
}

function adProductrunGift(show = false) {
  let ranking = JSON.parse(sessionStorage.getItem('ranking')) || [];
  let lastWinner = _.maxBy(ranking, 'score');
  let RANDOM_PRODUCT = JSON.parse(userData?.jsonProduct)[parseInt(userData?.idProduct)];
  if (show) {
    $('#notifyGift').css('display', 'block');
    runBackgroundrunGiftr(lastWinner, RANDOM_PRODUCT);
  } else {
    runBackgroundrunGiftr(lastWinner, RANDOM_PRODUCT);
    $('#notifyGift').css('display', 'none');
  }
}


function runBackgroundrunGiftr(lastWinner, RANDOM_PRODUCT) {
  let html = `<div id="ads-loading" class="ads-game-container" style="display: block;">
  <div class="loader"></div>
    </div>
    <div class="content-head">
      <h4>Chúc mừng ${_.get(lastWinner, 'user.0.name')}, bạn đã có quà...</h4>
    </div>
    <strong id="winner-name">${_.get(lastWinner, 'user.0.name')}</strong>
    <div class="wrapper-winner">
    <img class="image-avatar" style='width: 80px' src="${_.get(lastWinner, 'user.0.avatar')}">
    </div>
      <span class="product-name">${RANDOM_PRODUCT?.productName}</span>
      <img class="img-product" src="${RANDOM_PRODUCT?.image}" alt="Girl in a jacket">
      <strong class='price-text'>Giá trị quà: <span class='price-gift'>${convertVND(RANDOM_PRODUCT?.price)}<span></strong>

      <div class="gui-action">
        <p>- Để nhận quà hãy inbox cho ad qua tin nhắn</p>
        <p>- Để lại S.Đ.T</p>
        <p>- Ad sẽ gửi quà hoặc chuyển tiền theo giá trị quà tặng</p>
      </div>`;
  $("#notifyGift-content").html(html);
}


function ramdomNumberLastWinner(cb, option = { timer: 15000}) {
  adProductLastWinner(true);
  runningTime = true;
  setTimeout(() => {
    cb();
    adProductLastWinner(false);
  }, option.timer);
}

function adProductLastWinner(show = false) {
  if (show) {
    $('#lastwinner').css('display', 'block');
    runImageLastWinner(false);
  } else {
    runImageLastWinner(true);
    $('#lastwinner').css('display', 'none');
  }
}

function runImageLastWinner(remove = false) {
  if (!remove) {
    let ranking = JSON.parse(sessionStorage.getItem('ranking')) || [];
    let lastWinner = _.maxBy(ranking, 'score');
    showImgeInvalLastWinner = setInterval(() => {
      let RANDOM_PRODUCT = JSON.parse(userData?.jsonProduct);
      let randomIndex = Math.floor(Math.random() * RANDOM_PRODUCT.length);
      let IMG_DIR = RANDOM_PRODUCT[randomIndex];
      runBackgroundLastWinner(lastWinner, IMG_DIR);
    }, 500);
  }

  if (remove) {
    clearInterval(showImgeInvalLastWinner);
  }
}

function runBackgroundLastWinner(lastWinner, IMG_DIR) {
  let html = `<div id="ads-loading" class="ads-game-container" style="display: block;">
  <div class="loader"></div>
    </div>
    <div class="content-head">
      <h4>Đang tìm quà tặng cho người TOP 1 ..</h4>
    </div>
    <strong id="winner-name">${_.get(lastWinner, 'user.0.name')}</strong>
    <div class="wrapper-winner">
    <img class="image-avatar" style='width: 80px' src="${_.get(lastWinner, 'user.0.avatar')}">
    </div>
      <span class="product-name">${IMG_DIR?.productName}</span>
      <img class="img-product" src="${IMG_DIR?.image}" alt="Girl in a jacket">
      <strong class='price-text'>trị giá tặng: <span class='price-gift'>${convertVND(IMG_DIR?.price)}<span></strong>
      <div class="call-action">
        <svg class="icon-action" fill="red" height="50px" width="20px" version="1.1" id="Layer_1" xmlns="" xmlns:xlink="" 
          viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
        <polygon points="283.7,298.7 283.7,0 198.3,0 198.3,298.7 70.3,298.7 241,512 411.7,298.7 "/>
        </svg>
        <span class="text-hook">Click giỏ hàng xem quà tặng</span>
      </div>`;
  $("#lastwinner-content").html(html);
}


function getCoin() {
  let ranking = JSON.parse(sessionStorage.getItem('ranking')) || [];
  return Math.floor(Math.random() * _.meanBy(ranking, 'score')) + 5;
}


function runChungMung(winner) {
  let coinReceived = getCoin();
  runSpeakChungMung('congratulation');
  let remainingText =  `Chúc mừng bạn dành được <span class='send_coin'>${coinReceived}</span> <img style='width: 40px;' src='./images/khobau/dongxu.png' />`
  document.getElementById("winner-con").style.display = 'block';
  document.getElementById("winner-name").innerHTML = winner?.text;
  document.getElementById("image-avatar").src = winner?.image;
  document.getElementById("show-text").innerHTML = remainingText;

  setTimeout(() => {
    // clearInterval(chungMungIntertal);
    document.getElementById("winner-con").style.display = 'none';
    // document.getElementById('canvas').remove()
  }, 7000);
  connection.emit('send_coin', {winner, userData, coinReceived});
  audioChungMung();
}

function isTop() {
  let ranking = JSON.parse(sessionStorage.getItem('ranking')) || [];
  let sessionWinner = JSON.parse(sessionStorage.getItem('sessionWinner')) || {};
  let maxRank = Math.max(...ranking.map(o => o.score));
  let remaining = maxRank - sessionWinner?.score;
  return remaining === 0;
}


function ramdomNumber(cb, option = { timer: 12000}) {
  adProduct(true);
  // show winner
  runningTime = true;
  // let rumdomTime = setInterval(() => {
  // }, 100);
  setTimeout(() => {
    // clearInterval(rumdomTime);
    // setTimeout(() => {
    //   runningTime = false;
      cb();
    //   sessionStorage.removeItem('winner');
    // }, 50);
    adProduct(false);
  }, option.timer);
}

function adProduct(show = false) {
  if (show) {
    document.getElementById('ads-product').style.display = 'block';
    runImage(false);
  } else {
    runImage(true);
    document.getElementById('ads-product').style.display = 'none';
  }
}

function runImage(remove = false) {
  if (!remove) {
    showImgeInval = setInterval(() => {
      const RANDOM_PRODUCT = JSON.parse(userData?.jsonProduct);
      let randomIndex = Math.floor(Math.random() * RANDOM_PRODUCT.length);
      let IMG_DIR = RANDOM_PRODUCT[randomIndex];
      runBackground(IMG_DIR);
    }, 1000);
  }

  if (remove) {
    clearInterval(showImgeInval);
  }
}

function runBackground(IMG_DIR) {
  let html = `<div id="ads-loading" class="ads-game-container" style="display: block;">
  <div class="loader"></div>
    </div>
      <div class="content-head">
          <h3>Nếu ${_.get(selectedPrize, 'text')} là Top 1, bạn có thể nhận sản phẩm sau ..</h3>
      </div>
      <img class="img-product" src="${IMG_DIR?.image}" alt="Girl in a jacket">
      <strong class='price-text'>Trị giá quà tặng: <span class='price-gift'>${convertVND(IMG_DIR?.price)}<span></strong>
      <div class="call-action">
        <svg class="icon-action" fill="red" height="50px" width="20px" version="1.1" id="Layer_1" xmlns="" xmlns:xlink="" 
          viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
        <polygon points="283.7,298.7 283.7,0 198.3,0 198.3,298.7 70.3,298.7 241,512 411.7,298.7 "/>
        </svg>
        <span class="text-hook">Click giỏ hàng xem quà tặng</span>
      </div>`;
$("#content-ads").html(html);
}

