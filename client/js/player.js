

let showWord = false;
let runningTime = false;
// Lấy các phần tử DOM
const imageContainer = document.querySelector('.image-container');
const titleGame = document.querySelector('.title-game');

function randomArr(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Hiển thị hình ảnh trên trang web
function play() {
  showWord = false;
  const game = tiengviet();
  titleGame.innerHTML = `${game.suggest === '' ? '...' : game.suggest}`;
  sessionStorage.setItem('play', JSON.stringify(game));
  showPlayHtml(game);
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function showPlayHtml(game) {
  const wordArrOrigin = FunctionUtil.capitalizeFirstLetterInWords(game.word);
  const wordArrRandom = shuffleArray(wordArrOrigin.split(''));
  let html = '';
  for (let i = 0; i < wordArrRandom.length; i++) {
    const elm = showWord ? wordArrOrigin[i] : wordArrRandom[i];
    if (elm === ' ') {
      html += `<div class='space'></div>`;
    } else {
      html += `<div class='square'>${elm}${showWord ? '' : '/'}</div>`;
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

function startRunTimer(duration) {
  var display = document.getElementById('timer-countdown');
  let totalSeconds = duration;
  setInterval(function() {
    let minutes = parseInt(Math.floor(totalSeconds / 60), 10);
    let seconds = parseInt(totalSeconds % 60, 10);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    if (totalSeconds >= 0) {
      display.textContent = minutes + ':' + seconds;
    }
    // Replace with your own code to update the countdown display
    if (totalSeconds === duration) {
      play();
    }
    if (totalSeconds === 5) {
      showWord = true;
      showRanking(JSON.parse(sessionStorage.getItem('ranking')));
      showPlayHtml(JSON.parse(sessionStorage.getItem('play')))
    }
    if (totalSeconds === 0) {
      ramdomNumber((winner) => {
        totalSeconds = duration;
        runChungMung(JSON.parse(winner));
      });
    }
    totalSeconds--;
  }, 1000);

}


setTimeout(() => {
  if (sessionStorage.getItem('user')) {
    let setting = JSON.parse(sessionStorage.getItem('user'));
    startRunTimer(setting?.maxNumber);
  }
}, 500);


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
    // document.getElementById('canvas').remove()
  }, 7000);
  // audioChungMung();
}

function isTop() {
  let ranking = JSON.parse(sessionStorage.getItem('ranking')) || [];
  let sessionWinner = JSON.parse(sessionStorage.getItem('sessionWinner')) || {};
  let maxRank = Math.max(...ranking.map(o => o.score));
  let remaining = maxRank - sessionWinner?.score;
  return remaining === 0;
}

function adProduct(show = false) {
  // if (show) {
  //   document.getElementById('ads-product').style.display = 'block';
  //   runImage(false);
  // } else {
  //   runImage(true);
  //   document.getElementById('ads-product').style.display = 'none';
  // }
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
//     runChungMung()