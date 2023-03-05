
const socket = io("http://localhost:3000");
const messageList = document.getElementById('messages');
const messageForm = document.querySelector('form');
const messageInput = document.getElementById('message-input');
// const contrastColors = ['#000000', '#555555', '#006600', '#990000', '#006699', '#660066', '#FF6600', '#336633', '#333399', '#FF3333', '#33FF33', '#3333FF', '#FFFF33', '#FF33FF', '#33FFFF', '#CC3300', '#0066CC', '#CC0066', '#00CC66', '#6600CC'];
const luotView = [{
  soview: 100,
  money: 5.000,
  soview: 200,
  money: 10.000,
  soview: 100,
  money: 10.000,
}]
let isUserActive = false;
let userData = false;
let isScrollBottom = false;
let timeInterval;
let runningTime = false;
let luckyNumberFix;

const ramdomTime = [5000, 12000, 10000, 20000, 8000, 10000, 5000, 20000];

function ramdomAuto() {
  const numRandom = randomArr(ramdomTime);
  fetch('http://localhost:3000/api/get-member-random')
  .then(response => response.json())
  .then(data => {
    if (data[0].name) {
      let newStr = data[0].name.slice(0, 3) + "**" + data[0].name.slice(3, 5);
      document.getElementById('shopping').innerHTML = `${newStr} đang mua`
    }
  })
  .catch(error => {
    console.error('Lỗi:', error);
  });

  document.querySelector('.shoping').classList.add('move');

  setTimeout(() => {
    document.querySelector('.shoping').classList.remove('move');
  }, 3000);
  setTimeout(() => {
    ramdomAuto();
  }, numRandom);   
}

function randomArr(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
setTimeout(() => {
  ramdomAuto();
}, 2000);
getUserSecsion();

function getSesstion() {
  if (sessionStorage.getItem('user')) {
    return JSON.parse(sessionStorage.getItem('user'));
  }
}
function saveUserSecsion() {
  const username = document.getElementById('message-input');
  const timeInput = document.getElementById('time-input');
  const maxNumber = document.getElementById('max-number');
  sessionStorage.setItem('user', JSON.stringify({
    username: username.value,
    timeInput: timeInput.value,
    maxNumber: maxNumber.value
  }));
  getUserSecsion();
  location.reload();
}

function setInputItem() {
  const username = document.getElementById('message-input');
  const timeInput = document.getElementById('time-input');
  const maxNumber = document.getElementById('max-number');
  timeInput.value = userData?.timeInput || '';
  maxNumber.value = userData?.maxNumber || '';
  username.value = userData?.username || '';
}
function getUserSecsion() {
  if (sessionStorage.getItem('user')) {
    userData = JSON.parse(sessionStorage.getItem('user'));
    isUserActive = true;
    setTimeout(() => {
      setInputItem()
      socket.on(userData?.username, (msg) => {
        if (msg.type === 'view') {
          document.getElementById('viewers').innerHTML = msg.viewers;
          return;
        }
        htmlMessage(msg);
        autoScrollBottom();
      });

      socket.on('calculateTime_' + userData?.username, (msg) => {
        if (msg.type === 'add') {
          sessionStorage.setItem('sessionLucky', JSON.stringify(msg))
        } else if (msg.type === 'winners') {
          console.log({mesggg: msg})
          runChungMung(msg);
        }
      });
    }, 500);
  }
}
const usersJoined = [];
function htmlMessage(msg) {
  let maxLength = 0;
  if (parseInt(userData?.maxNumber) < 10) {
    maxLength = 1;
  } else if (parseInt(userData?.maxNumber) < 100) {
    maxLength = 2;
  } else if (parseInt(userData?.maxNumber) < 1000) {
    maxLength = 3;
  }  else if (parseInt(userData?.maxNumber) < 10000) {
    maxLength = 4;
  }
  let html = '';
  if (usersJoined.length > 20) {
    usersJoined.splice(0, 1)
  }
  usersJoined.push({
    avatar: msg.avatar,
    message: msg.textMessage,
    fullname: msg.userNameElement,
    luckyNumber: msg.luckyNumber,
  });
  for (let i = 0; i < usersJoined.length; i++) {
    const element = usersJoined[i];
      let luckNumber = '';
      if (element.luckyNumber) {
        if (JSON.stringify(element.luckyNumber).length >= maxLength) {
          luckNumber = JSON.stringify(element?.luckyNumber).slice(0, maxLength);
        } else {
          luckNumber = element.luckyNumber;
        }
      }
      // let randomColor = contrastColors[Math.floor(Math.random() * contrastColors.length)]
      html += `<div class="container">
        <div class='left'><img src="${element.avatar}" alt="Avatar" class="avatar"></div>
        <strong>${element.fullname}: </strong>
        <span>${element.message}</span>
        ${luckNumber != '' ? `<span class='lucky-number'>${luckNumber}</span>` : ''}
      </div>`;
  }
  document.getElementById('container-scroll').innerHTML = html;
}

function autoScrollBottom() {
  if (sessionStorage.getItem('scroll')) {
    let scElm = document.getElementById('container-scroll');
    scElm.scrollTop = scElm.scrollHeight;
  }
}
function resetSession() {
  sessionStorage.removeItem('user');
  location.reload();
}

setTimeout(() => {
  let scElm = document.getElementById('container-scroll');
  scElm.onscroll = function(ev) {
    isScrollBottom = false;
    if ([scElm.scrollTop - (scElm.scrollHeight - scElm.offsetHeight)] >= 0) {
      isScrollBottom = true;
    }
};
}, 500);


function usersJoinedFunction (style = false) {
  let luckNumber = Math.floor((Math.random() * getSesstion()?.maxNumber) + 1)
  if (style) {
    document.getElementById('luck-number').innerHTML = luckNumber;
    document.getElementById('luck-number').style.color = 'red';
    document.getElementById('luck-number').style.fontSize = '40px';
  } else {
    document.getElementById('luck-number').innerHTML = luckNumber;
    document.getElementById('luck-number').style.color = 'blue';
  }
  return luckNumber;
}

function ramdomNumber(cb) {
  runningTime = true;
  let rumdomTime = setInterval(() => {
    usersJoinedFunction();
  }, 100);

  setTimeout(() => {
    clearInterval(rumdomTime);
    setTimeout(() => {
      runningTime = false;
      luckyNumberFix = usersJoinedFunction(true);
      cb(luckyNumberFix);
    }, 50);
  }, 5000);
}
function startTimer(duration) {
    var display = document.getElementById('timer-countdown');
    var timer = duration, minutes, seconds;
    timeInterval = setInterval(function () {
      minutes = parseInt(timer / 60, 10)
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
      if (--timer < 0) {
        timer = duration;
      }
      if (timer === 0) {
        ramdomNumber((number) => {
          calculateTime('end', number);
        });
      }
    }, 1000);
}

function calculateTime(time, number = null) {
  if (time === 'start') {
    socket.emit('calculateTime', {
      time,
      liver: userData?.username,
      timeInput: userData?.timeInput,
    })
  } else if (time === 'end') {
    socket.emit('calculateTime', {
      viewers: document.getElementById('viewers')?.textContent,
      time,
      liver: userData?.username,
      timeInput: userData?.timeInput,
      luckyNumber: number,
      ...JSON.parse(sessionStorage.getItem('sessionLucky')),
    });
  }
}
setTimeout(() => {
  startTimer(getSesstion()?.timeInput || 300);
}, 500)

function scrollBottom() {
  if (sessionStorage.getItem('scroll')) {
    sessionStorage.removeItem('scroll');
    scrollActive();
  } else {
    sessionStorage.setItem('scroll', 'true');
    scrollActive();
  }
}

function scrollActive() {
  if (sessionStorage.getItem('scroll')) {
    document.getElementById('scrollBottom').innerHTML = 'Kéo xuống';
  } else {
    document.getElementById('scrollBottom').innerHTML = '------';
  }
}
setTimeout(() => {
  scrollActive();
}, 500)

function runChungMung(msg) {
  function coverVND(string) {
    return string.toLocaleString('vi', {style : 'currency', currency : 'VND'});
  }
  const data = msg.dataLive.winners[0];
  document.getElementById("popup").style.display = "block";
  document.getElementById("winner-popup").innerHTML= data?.name || 'Không có người trúng giải';
  if (!data) {
    setTimeout(() => {
      document.getElementById("popup").style.display = "none";
      document.getElementById("money-popup").innerHTML = "";
    }, 3000);
    return;
  }
  document.getElementById("money-popup").innerHTML = `
  <span style='color: blue; font-size: 20px'>Số: ${msg.dataLive.luckyNumber}</span><br>
  <span style='color: red; font-size: 20px'>Số tiền: ${coverVND(msg.dataLive.numberPrize)}</span>`;
  let chungMungIntertal = setInterval(() => {
    getCongraguation();
  }, 1000);

  setTimeout(() => {
    clearInterval(chungMungIntertal);
    document.getElementById("popup").style.display = "none";
    document.getElementById('canvas').remove()
  }, 7000);
  audioChungMung();
}

