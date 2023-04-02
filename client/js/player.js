

let showWord = false;
let runningTime = false;
// Lấy các phần tử DOM
const imageContainer = document.querySelector('.image-container');

function randomArr(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Hiển thị hình ảnh trên trang web
function play() {
  showWord = false;
  const game = dhbc();
  imageContainer.innerHTML = `<img class="zoom-in-out-box" src="${game.image}" alt="Hình ảnh">`;
  sessionStorage.setItem('play', JSON.stringify(game));
  showPlayHtml(game);
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

function ramdomNumber(cb) {
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
  }, 8000);
}

function startTimer(duration) {
  var display = document.getElementById('timer-countdown');
  var timer = duration, minutes, seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;
    if (timer === duration) {
      play();
    }
    if (runningTime && timer === 0) {
      console.log(111)
      return;
    }
    if (timer === 5) {
      showWord = true;
      showRanking(JSON.parse(sessionStorage.getItem('ranking')));
      showPlayHtml(JSON.parse(sessionStorage.getItem('play')))
    }
    if (timer === 3) {
      // initSpeak('introProduct', {});
    }
    if (--timer < 0) {
      timer = duration;
    }
    if (timer === 0) {
      ramdomNumber((winner) => {
        runChungMung(JSON.parse(winner));
      });
    }
  }, 1000);
}


setTimeout(() => {
  if (sessionStorage.getItem('user')) {
    let setting = JSON.parse(sessionStorage.getItem('user'));
    startTimer(setting?.maxNumber);
  }
}, 500);


function runChungMung(winner) {
  if (!winner) {
    return;
  }
  runSpeakChungMung('congratulation');
  let remainingText = ''
  if (isTop()) {
    remainingText = `Oa ! Bạn là top 1, Duy trì để lấy quà nhé 😍`
  } else {
    remainingText = `Bạn sắp đuổi kịp top 1 rồi, cố lên ^^`
  }
  document.getElementById("winner-con").style.display = 'block';
  document.getElementById("winner-name").innerHTML = winner?.name;
  document.getElementById("winner-avatar").src = winner?.avatar;
  document.getElementById("show-text").innerHTML = remainingText;
  let chungMungIntertal = setInterval(() => {
    getCongraguation();
  }, 1000);

  setTimeout(() => {
    clearInterval(chungMungIntertal);
    document.getElementById("winner-con").style.display = 'none';
    document.getElementById('canvas').remove()
  }, 7000);
  // audioChungMung();
}

function isTop() {
  let ranking = JSON.parse(sessionStorage.getItem('ranking')) || [];
  let sessionWinner = JSON.parse(sessionStorage.getItem('sessionWinner')) || {};
  let maxRank = Math.max(...ranking.map(o => o.score));
  console.log({maxRank, sessionWinner})
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
  }, 1500);
  if (remove) {
    clearInterval(showImgeInval);
  }
}
//     runChungMung()