
const URL_API = 'https://319e-2001-ee0-41c1-3d38-ad1f-3921-8569-5761.ap.ngrok.io';

const socket = io(URL_API);
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
const top45 = [{
  name: 'Đình thái văn',
  luckMoney: 20000,
},
{
  name: 'Hương nguyễn',
  luckMoney: 50000,
}];
const ranDomRating = (msg) => {
  let winner = _.get(msg, 'dataLive.winners.0', false);
  let top3 = [{
    name: 'Duy phạm',
    luckMoney: 600000,
  }, {
    name: 'Nợ đời',
    luckMoney: 600000,
  }, {
    name: 'Thầy thiên hạ 102',
    luckMoney: 1000000,
  }, {
    name: 'Em làm em chịu',
    luckMoney: 300000,
  }, {
    name: 'Thời trang nam(cẩm tú)',
    luckMoney: 600000,
  }, {
    name: 'Nguyễn Hằng',
    luckMoney: 350000,
  }];
  if (_.get(winner, 'name', false)) {
    top45.push({
      name: winner?.name,
      luckMoney: winner?.type === 'ramdom' ? winner?.prize : winner?.prizeNumber,
    });
    const totalWinnerss = sessionStorage.getItem('totalWinners');
    if (!totalWinnerss) {
      sessionStorage.setItem('totalWinners', JSON.stringify(350));
    } else {
      sessionStorage.setItem('totalWinners', parseInt(totalWinnerss) + 1);
    }
  }
  if (top45.length > 2) {
    top45.splice(0, 1)
  }
  let randomIndex = Math.floor(Math.random() * (top3.length - 2)); // Lấy một chỉ số ngẫu nhiên từ 0 đến 3 (length - 2 để tránh trường hợp chỉ số cuối cùng vượt quá độ dài của mảng)
  let randomArrayTop3 = top3.slice(randomIndex, randomIndex + 3); // Lấy mảng bắt đầu từ chỉ số ngẫu nhiên và có độ dài 3
  return {
    totalWinners: sessionStorage.getItem('totalWinners'),
    type: 'week',
    listRatings: _.concat(randomArrayTop3, top45),
  }
}

setTimeout(() => {
  runRating()
}, 500)
function ramdomAuto() {
  const numRandom = randomArr(ramdomTime);
  fetch(`${URL_API}/api/get-member-random`)
  .then(response => response.json())
  .then(data => {
    if (data[0].name) {
      let nameUser = _.get(data, '0.name', '');
      nameUser = nameUser.replace(/[^\w\s]/gi, '');
      nameUser = nameUser.slice(0, 3) + "**" + nameUser.slice(3, 5);
      document.getElementById('shopping').innerHTML = `${nameUser} đang mua`;
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
          runChungMung(msg);
          runRating(msg);
        }
      });
      // socket.emit('message_alo', {data: ''})
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

      let avatar = element.avatar;
      let message = element.message;
      let fullname = element.fullname;
      if (_.includes(element.message, 'followed the host')) {
        avatar = 'http://cdn.onlinewebfonts.com/svg/img_193993.png';
        fullname = ` <span>Cảm ơn <strong style="color: red;">${element.fullname}</strong> đã Follow live nhé</span>`;
        message = '';
      } else  if (_.includes(element.message, 'shared the')) {
        avatar = 'https://cdn-icons-png.flaticon.com/512/25/25702.png';
        fullname = ` <span>Cảm ơn <strong style="color: red;">${element.fullname}</strong> đã chia sẻ live nhé </span>`;
        message = '';
      } else if (_.includes(element.message, 'liked the LIVE')) {
        message = '';
        fullname = `  <span>Cảm ơn <strong style="color: red;">${element.fullname}</strong> đã thả tim live nhé</span>`;
        avatar = 'https://img.lovepik.com/free-png/20210918/lovepik-heart-shaped-png-image_400222937_wh1200.png';
      }

      // let randomColor = contrastColors[Math.floor(Math.random() * cont rastColors.length)]
      html += `<div class="container">
        <div class='left'><img src="${avatar}" alt="Avatar" class="avatar"></div>
        <strong>${fullname} </strong>
        <span>${message}</span>
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

function coverVND(string, currency = 'VND') {
  return string.toLocaleString('vi', {style : 'currency', currency});
}

function runChungMung(msg) {
  console.log({msg})
  const data = _.get(msg, 'dataLive.winners.0');
  if (!_.get(data, 'name', false)) {
    document.getElementById("popup").style.display = "block";
    document.getElementById("winner-popup").innerHTML= `Chưa có ai tham thai lần này`;
    setTimeout(() => {
      document.getElementById("popup").style.display = "none";
    }, 3000);
    document.getElementById("money-popup").innerHTML = "";
    return;
  } else {
    document.getElementById("popup").style.display = "block";
    document.getElementById("winner-popup").innerHTML= `Chúc mừng: <span style="color: rgb(255, 0, 0); font-size: 20px;"> ${data?.name}</span>`;
  }
  document.getElementById("money-popup").innerHTML = `
  <span style='color: blue; font-size: 20px'>Thưởng ngẫu nhiên => ${coverVND(data.prize)}</span><br>
  <span style='color: blue; font-size: 20px'>Thưởng theo số: ${data.numberLucky} => ${coverVND(data.prizeNumber)}</span>`;
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

function runRating(msg) {
  let {listRatings, totalWinners, type} = ranDomRating(msg);
  let html = '';
  let maxNumberRating =  1000000;

  for (let i = 0; i < listRatings.length; i++) {
    const elm = listRatings[i];
    let perNum = (elm.luckMoney / maxNumberRating) * 100;
    html += `<div class="rating-wrap">
  <div class="side">
    <div>${_.get(elm, 'name', '').length > 6 ? elm?.name.slice(0, 6) + ".." : _.get(elm, 'name', '')}</div>
  </div>
  <div class="middle">
    <div class="bar-container">
      <div style='width: ${perNum}%' class="bar-${5 - i}"></div>
    </div>
  </div>
  <div class="side right">
    <div>${coverVND(elm?.luckMoney)}</div>
  </div>
</div>`;
    document.getElementById('rating-list').innerHTML = html;
    document.getElementById('total-number').innerHTML = `Có ${totalWinners} người trúng thưởng ${type == 'week' ? 'tuần' : 'ngày'} qua`;
  }
}










let isSpeaking = false;
setTimeout(() => {
  socket.on('text-to-speech', (data) => {
    if (!isSpeaking) {
      runText(data);
    }
  })
}, 500);

function runText(data) {
  isSpeaking = true;
  let textSpeak = `${data.nickname} nói là ${data.comment}`;
  fetch('https://ntt123-viettts.hf.space/api/predict/',
    {
      method: "POST", body: JSON.stringify(
        { "data": [textSpeak] }
      ),
      headers: { "Content-Type": "application/json" }
    }).then(function (response) {
      return response.json();
    }).then(function (json_response) {
      if (_.get(json_response, 'data[0]', '')) {
        const binaryData = atob(json_response.data[0].split(',')[1]);
        const dataUri = "data:audio/mpeg;base64," + btoa(binaryData);
        const audio = new Audio(dataUri);
        audio.addEventListener('ended', function() {
          isSpeaking = false;
        });
        audio.play();
      } else {
        isSpeaking = false;
      }
    })
}