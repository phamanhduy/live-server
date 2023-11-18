

let showWord = false;
let runningTime = false;
let timerRuning;
// Lấy các phần tử DOM
const imageContainer = document.querySelector('.image-container');

function ramdomNumberArr(number = 10) {
  let arrayCoin = [];
  for (let i = 0; i <= number; i++) {
    arrayCoin.push(Math.floor(Math.random() * number) + 1);
  }
  return arrayCoin;
}

function randomArr(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Hiển thị hình ảnh trên trang web
// function play() {
//   showWord = false;
//   const game = dhbc();
//   imageContainer.innerHTML = `<img class="zoom-in-out-box" src="${game.image}" alt="Hình ảnh">`;
//   sessionStorage.setItem('play', JSON.stringify(game));
//   showPlayHtml(game);
// }

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

function ramdomNumber(cb, option = { timer: 10000}) {
  adProduct(true);
  // show winner
  runningTime = true;
  let rumdomTime = setInterval(() => {
  }, 100);
  setTimeout(() => {
    clearInterval(rumdomTime);
    setTimeout(() => {
      runningTime = false;
      cb(sessionStorage.getItem('winner'));
      sessionStorage.removeItem('winner');
    }, 50);
    adProduct(false);
  }, option.timer);
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
      ramdomNumber((winner) => {
        totalSeconds = duration;
        // runChungMung(JSON.parse(winner));
      });
    }
    totalSeconds--;
  }, 1000);
}

// function countdown(duration) {
//   let totalSeconds = duration;
//   setInterval(function() {
//     let hours = Math.floor(totalSeconds / 3600);
//     let minutes = Math.floor((totalSeconds % 3600) / 60);
//     let seconds = totalSeconds % 60;

//     hours = hours < 10 ? '0' + hours : hours;
//     minutes = minutes < 10 ? '0' + minutes : minutes;
//     seconds = seconds < 10 ? '0' + seconds : seconds;
//     let display = document.getElementById('time-finish');
//     display.textContent = hours + ':' + minutes + ':' + seconds;
//     totalSeconds--;
//     if (totalSeconds === 0) {
//       totalSeconds = duration;
//     }
//   }, 1000);
// }

// setTimeout(() => {
//   if (sessionStorage.getItem('user')) {
//     countdown(10800);
//   }
// }, 500)

function getCoin() {
  return Math.floor(Math.random() * viewerCount) + 5;
}

function runChungMung(winner) {
  let coinReceived = getCoin();
  // runSpeakChungMung('congratulation');
  let remainingText =  `Chúc mừng bạn dành được <span class='send_coin'>${coinReceived}</span> <img style='width: 40px;' src='./images/khobau/dongxu.png' />`
  document.getElementById("winner-con").style.display = 'block';
  document.getElementById("winner-name").innerHTML = winner?.text;
  document.getElementById("winner-avatar").src = winner?.image;
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
  let showImgeInval = setInterval(() => {
    const RANDOM_PRODUCT = [
      {
        dir: 'IMG_PRODUCT',
        total: 25,
      },
    ];
    let randomIndex = Math.floor(Math.random() * RANDOM_PRODUCT.length);
    let IMG_DIR = RANDOM_PRODUCT[randomIndex];
    let IMG_RAN = Math.floor((Math.random() * IMG_DIR.total) + 1);
    let srcImg = `${URL_API}/${IMG_DIR.dir}/img_product (${IMG_RAN + 1}).jpeg`;
    document.getElementById('img-product').src = srcImg;
  }, 4000);
  if (remove) {
    clearInterval(showImgeInval);
  }
}
