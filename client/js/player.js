

let showWord = false;
let runningTime = false;
let isSpeaking = false;
// Lấy các phần tử DOM
const imageContainer = document.querySelector('.image-container');

function randomArr(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Tạo một đối tượng chứa thông tin của trò chơi
const gameResounce = [{
  image: 'https://e.gamevui.vn/web/2014/10/batchu/assets/pics/xygl-vygl.jpg', // Tên tệp hình ảnh
  word: 'EM LÀ NAM',
  suggest: 'Đây là 1 loại quả có thể ăn được, nó nằm trên cây cao, tôi không nhớ rõ những bạn thử đoán xem'
},
{
  image: 'https://cdn.tgdd.vn//GameApp/-1//toan-bo-dap-an-game-bat-chu-duoi-hinh-bat-chu4-800x532-800x532.jpg', // Tên tệp hình ảnh
  word: 'SIÊU NHÂN', // Từ cần đoán
  suggest: 'Đây là tên một thực phẩm phổ biến nhất việt nam, nó nằm trên cây cao '
},
{
  image: 'https://i1-vnexpress.vnecdn.net/2015/04/25/4-7254-1429945566.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=BOVPmjRPLSLqokpNS5YhpQ', // Tên tệp hình ảnh
  word: 'MỌI NGƯỜI ƠI', // Từ cần đoán
  suggest: 'Tôi xin gợi ý đây là 1 loại thuốc, nó cực tốt cho sức khỏe'
},
{
  image: 'https://i1-vnexpress.vnecdn.net/2015/06/28/4-1679-1435503803.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=Ik91F0u4Ma_IFOY8hEGAMw', // Tên tệp hình ảnh
  word: 'CHÀO MỌI', // Từ cần đoán
  suggest: 'Thôi câu này quá dễ rồi tôi không cần gợi ý, bạn cứ nhìn theo thứ tự là sẽ ra đáp án'
}
];

// Hiển thị hình ảnh trên trang web
function play() {
  showWord = false;
  const game = randomArr(gameResounce);
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
  timeInterval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;
    if (timer === duration) {
      calculateTime('start');
    }
    if (runningTime && timer === 0) {
      return;
    }
    if (timer === 5) {
      showWord = true;
      showRanking(JSON.parse(sessionStorage.getItem('ranking')));
      showPlayHtml(JSON.parse(sessionStorage.getItem('play')))
    }
    if (--timer < 0) {
      timer = duration;
    }
    if (timer === 0) {
      ramdomNumber((winner) => {
        runChungMung(JSON.parse(winner))
      });
    }
  }, 1000);
}


function calculateTime(time, number = null) {
  play();
}

setTimeout(() => {
  if (sessionStorage.getItem('user')) {
    let setting = JSON.parse(sessionStorage.getItem('user'));
    startTimer(setting?.maxNumber);
  }
}, 500);

function runText(msg) {
  isSpeaking = true;
  fetch('https://ntt123-viettts.hf.space/api/predict/',
    {
      method: "POST", body: JSON.stringify(
        { "data": [msg] }
      ),
      headers: { "Content-Type": "application/json" }
    }).then(function (response) {
      return response.json();
    }).then(function (json_response) {
      if (_.get(json_response, 'data[0]', '')) {
        const binaryData = atob(json_response.data[0].split(',')[1]);
        const dataUri = "data:audio/mpeg;base64," + btoa(binaryData);
        const audio = new Audio(dataUri);
        audio.addEventListener('ended', function () {
          isSpeaking = false;
        });
        audio.play();
      } else {
        isSpeaking = false;
      }
    })
}


function runChungMung(winner) {
  if (!winner) {
    return;
  }
  let ranking = JSON.parse(sessionStorage.getItem('ranking')) || [];
  let sessionWinner = JSON.parse(sessionStorage.getItem('sessionWinner')) || [];
  let maxRank = Math.max(...ranking.map(o => o.score));
  let remaining = maxRank - sessionWinner?.score;
  let remainingText = ''
  if (remaining === 0) {
    remainingText = `Oa ! Bạn là top 1, Duy trì để lấy tiền nhé 😍`
  } else {
    remainingText = `Còn ${remaining} điểm nữa bạn sẽ giành top 1 rồi ^^`
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