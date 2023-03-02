
const socket = io("http://localhost:3000");
const messageList = document.getElementById('messages');
const messageForm = document.querySelector('form');
const messageInput = document.getElementById('message-input');
const contrastColors = ['#000000', '#555555', '#006600', '#990000', '#006699', '#660066', '#FF6600', '#336633', '#333399', '#FF3333', '#33FF33', '#3333FF', '#FFFF33', '#FF33FF', '#33FFFF', '#CC3300', '#0066CC', '#CC0066', '#00CC66', '#6600CC'];
let isUserActive = false;
let userData = false;
let isScrollBottom = false;
let timeInterval;
// var regex = /\d+/g;
// var string = "you can enter 600 maximum 500 choices 4";
// var matches = string.match(regex);  // creates array from matches

// document.write(matches);
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
  // username.disabled = true;
  // buttonInput.disabled = true;
}
function getUserSecsion() {
  if (sessionStorage.getItem('user')) {
    userData = JSON.parse(sessionStorage.getItem('user'))
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
      let randomColor = contrastColors[Math.floor(Math.random() * contrastColors.length)]
      html += `<div class="container">
        <div class='left'><img src="${element.avatar}" alt="Avatar" class="avatar"></div>
        <strong>${element.fullname}: </strong>
        <span>${element.message}</span>
        ${luckNumber != '' ? `<span class='lucky-number'>${luckNumber}</span>` : ''}
      </div>`;
  }
  document.getElementById('container-scroll').innerHTML = html;
}

function autoScrollBottom(params) {
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
}

function ramdomNumber(params) {
  let rumdomTime = setInterval(() => {
    usersJoinedFunction()
  }, 50);

  setTimeout(() => {
    clearInterval(rumdomTime);
    setTimeout(() => {
      usersJoinedFunction(true);
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

      if (--timer < 0) {
        timer = duration;
      }
      if (timer === 0) {
        ramdomNumber();
      }
    }, 1000);
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
