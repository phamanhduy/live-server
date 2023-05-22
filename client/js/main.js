var loadingPage = false;
var userData = null;
let isScrollBottom = false;

function getUserSecsion() {
  if (sessionStorage.getItem('user')) {
    userData = JSON.parse(sessionStorage.getItem('user'));
    // URL_API = _.get(userData, 'serverInput');
    // socket = io(URL_API);
  }
}

var URL_API = _.get(JSON.parse(sessionStorage.getItem('user')), 'serverInput') || 'http://localhost:3000';
var socket = io(URL_API);

function saveUserSecsion(isConnect = true) {
    const channel = document.getElementById('message-input');
    const maxNumber = document.getElementById('time-input');
    const sessionLive = document.getElementById('live-section');
    const serverInput = document.getElementById('server-input');
    // const startPlay = document.getElementById('start-play');
    sessionStorage.setItem('user', JSON.stringify({
      channel: channel.value,
      maxNumber: maxNumber.value,
      liveSession: sessionLive.value,
      serverInput: serverInput.value,
    }));
    setTimeout(() => {
      getUserSecsion();
      connectionTiktok();
    }, 500);
    if (isConnect) {
      socket.emit(`connect-tiktok`, {
        channel: userData?.channel,
        liveSession: userData?.liveSession
      });
    }
}
function eventListener(data) {
  receivedMessage(data);
  autoScrollBottom();
}
function connectionTiktok() {
  if (sessionStorage.getItem('user')) {
    userData = JSON.parse(sessionStorage.getItem('user'));
    loadingPage = true;
    loadingPageFun(loadingPage);
    socket.on(`${userData?.channel}`, eventListener);

    socket.on(`connect-success-${userData?.channel}`, () => {
      alert(`Kết nối ${userData?.channel} thành công`);
    });
    socket.on(`disconnect-${userData?.channel}`, () => {
      alert(`${userData?.channel} bị ngắt kết nối`);
    });
    getRanking();
    socket.on(`${userData?.channel}-ranking`, (dataLive) => {
      showRanking(_.get(dataLive, 'ranking'));
      if (_.get(dataLive, 'sessionWinner')) {
        sessionStorage.setItem('sessionWinner', JSON.stringify(_.get(dataLive, 'sessionWinner')))
      }
    });
    closeInventory();
  }
}

function disConnect () {
  if (sessionStorage.getItem('user')) {
    socket.emit(`dis-connect-${userData?.channel}`, '');
    closeInventory();
  }
}

let connectionTimeout = setTimeout(() => {
  clearInterval(connectionTimeout);
  socket.off(`${userData?.channel}`, eventListener);
  getUserSecsion();
  connectionTiktok(userData);
  loadingPageFun(loadingPage);
  loadingPageData();
}, 500);

function loadingPageData() {
  if (userData) {
    const channel = document.getElementById('message-input');
    const maxNumber = document.getElementById('time-input');
    const sessionLive = document.getElementById('live-section');
    const serverInput = document.getElementById('server-input');

    channel.value = userData?.channel;
    maxNumber.value = userData?.maxNumber;
    sessionLive.value = userData?.liveSession;
    serverInput.value = userData?.serverInput;
    // startPlay.value = userData?.startPlay;
    // document.getElementById('player-name').innerHTML = `@${userData?.channel.length > 8 ? `${userData?.channel.slice(0, 8)}...` : userData?.channel}`
  } 
}
function loadingPageFun(loading) {
  // if (loading) {
  //   document.getElementById('loading').style.display = 'block';
  // } else {
  //   document.getElementById('loading').style.display = 'none';
  // }
}

// Opens inventory
const openInventory = () => {
  let openInv = document.querySelector('#inventory');
  openInv.style.display = "flex";
}

// Closes inventory
const closeInventory = () => {
  // let openInv = document.querySelector('#inventory');
  // openInv.style.display = 'none';
}

function receivedMessage(dataLive) {
  if (_.get(dataLive, 'type') === 'view') {
    return showNumberViewer(dataLive);
  } else if (_.get(dataLive, 'type') === 'comment') {
    htmlMessage(dataLive);
    if (sessionStorage.getItem('winner')) {
      return;
    }
    return caculator(dataLive);
  } else {
    htmlMessage(dataLive)
  }

}

function showNumberViewer(dataLive) {
  document.getElementById('viewers').innerHTML = _.get(dataLive, 'viewers');
}

function caculator(dataLive) {
  if (userData) {
    let game = JSON.parse(sessionStorage.getItem('play'));
    let gameWord = _.get(game, 'word', '').toLowerCase();
    let comment = _.get(dataLive, 'comment').toLowerCase();
    if (game) {
      if (_.includes(comment, gameWord)) {
        sessionStorage.setItem('winner', JSON.stringify(dataLive));
        saveSpeaking('congratulation', dataLive)
        socket.emit(`score-winner`, {
          ...dataLive,
          liveSession: userData?.liveSession
        });
      }
    }
  }
}

// setInterval(() => {
//   getRanking();
// }, 7000)
function getRanking() {
  if (userData) {
    fetch(`${URL_API}/api/get-ranking?session=${userData?.liveSession}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
    .then((json) => {
      showRanking(json);
    })
    .catch((err) => {
      console.error(err);
    });
  }
}

function showRanking(data) {
  sessionStorage.setItem('ranking', JSON.stringify(data));
  let avatar = 'https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg';
  let rankingArr = new Array(15).fill({
    avatar,
    name: null,
    score: 0,
  })
  _.assign(rankingArr, _.map(data, (d, i) => {
    return {
      avatar: _.get(d, 'user.0.avatar'),
      name: _.get(d, 'user.0.name'),
      score: d.score
    }
  }));
  let tongDiem = rankingArr.reduce(function(total, r) {
    return total + r.score;
  }, 0);
  rankingArr = _.orderBy(rankingArr, ['score'], ['desc']).map((d, i) => ({
    avatar: _.get(d, 'avatar'),
    name: _.get(d, 'name') || `Top${i+1}`,
    score: d.score
  }));
  var group1 = rankingArr.slice(0, 5);    // 5 objects from index 0 to index 4
  var group2 = rankingArr.slice(5, 10);   // 5 objects from index 5 to index 9
  var group3 = rankingArr.slice(10, 15);  // 5 objects from index 10 to index 14
  
  var groups = [group1, group2, group3];
  let html = '';
  for (let i = 0; i < groups.length; i++) {
    let elm = groups[i];
    let htmlItem = '';
    for (let e = 0; e < elm.length; e++) {
      let elmItem = elm[e];
      let percen = (elmItem.score / tongDiem) * 100;
      htmlItem += `<tr>
          <td style="margin-right: 5px;">
            <img class="raking-avatar" src='${elmItem.avatar}'>
          </td>
          <td style="width: 60px">
            <div class="bar-container">
              <div style='width: ${percen}%' class="bar-${i + 1}">
                <span>${elmItem.name.length > 7 ? `${elmItem.name.slice(0, 7)}..` : elmItem.name}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="side right">
              <div>${elmItem.score}</div>
            </div>
          </td>
        </tr>`
    }
    html += `<table class="ranking">
              ${htmlItem}
            </table>`
  }

  document.getElementById('group-table').innerHTML = html;
}

function add3Dots(string, limit)
{
  var dots = "...";
  if(string.length > limit)
  {
    // you can also use substr instead of substring
    string = string.substring(0,limit) + dots;
  }

    return string;
}

const usersJoined = [];
const spea = [];
function htmlMessage(msg) {
  let html = '';
  if (usersJoined.length > 20) {
    usersJoined.splice(0, 1)
  }
  // console.log({msg})
  usersJoined.push(msg);
  for (let i = 0; i < usersJoined.length; i++) {
    const element = usersJoined[i];

      let avatar = element.avatar;
      let comment = element.comment || '';
      let fullname = '';
      if (_.get(element, 'type') === 'follow') {
        avatar = 'http://cdn.onlinewebfonts.com/svg/img_193993.png';
        fullname = ` <span>Cảm ơn <strong style="color: red;">${add3Dots(element.name, 20)}</strong> đã Follow live nhé</span>`;
        // runSpeaking(`Cảm ơn ${element.name} đã pho lâu lai chim nhé hi hi`, () => {});
      } else  if (_.get(element, 'type') === 'share') {
        // runSpeaking(`Cảm ơn ${element.name} đã xe lai chim nhé hi hi`, () => {});
        avatar = 'https://cdn-icons-png.flaticon.com/512/25/25702.png';
        fullname = ` <span>Cảm ơn <strong style="color: red;">${add3Dots(element.name, 20)}</strong> đã chia sẻ live nhé </span>`;
      } else if (_.get(element, 'type') === 'like') {
        // runSpeaking(`Cảm ơn ${element.name} đã xe lai chim nhé hi hi`, () => {});
        fullname = `  <span>Cảm ơn <strong style="color: red;">${add3Dots(element.name, 20)}</strong> đã thả <strong style="color: red;">${element.likeCount}</strong> trái tim ạ</span>`;
        avatar = 'https://img.lovepik.com/free-png/20210918/lovepik-heart-shaped-png-image_400222937_wh1200.png';
      } else if (_.get(element, 'type') === 'joined') {
        // runSpeaking(`Chào mừng ${element.name} vào xem lai chim nha`, () => {});
        fullname = `  <span>Chào mừng <strong style="color: red;">${add3Dots(element.name, 20)}</strong> đã vào livestream nhé</span>`;
        avatar = 'https://icon-library.com/images/meeting-room-icon/meeting-room-icon-12.jpg';
      } else if (_.get(element, 'type') === 'comment') {
        // runSpeaking(`${element.name} bình luận là ${comment}`, () => {});
      }

      // let randomColor = contrastColors[Math.floor(Math.random() * cont rastColors.length)]
      html += `<div class="container">
        <div class='left'><img src="${avatar}" alt="Avatar" class="avatar"></div>
        <strong style="color: #000; float: left">${fullname} </strong>
        <span style="color: #000; float: left">${add3Dots(comment, 50)}</span>
      </div>`;
  }
  document.getElementById('container-scroll').innerHTML = html;
  runLiveStream()
  
}

function runLiveStream() {
  let element = usersJoined[usersJoined.length - 1];
  if (_.get(element, 'type') === 'follow') {
    runSpeaking(`Cảm ơn ${element.name} đã pho lâu lai chim nhé hi hi`, () => {});
  } else  if (_.get(element, 'type') === 'share') {
    runSpeaking(`Cảm ơn ${element.name} đã xe lai chim nhé hi hi`, () => {});
  } else if (_.get(element, 'type') === 'like') {
    runSpeaking(`Cảm ơn ${element.name} đã thả tim lai chim nhé hi`, () => {});
  } else if (_.get(element, 'type') === 'joined') {
    runSpeaking(`Chào mừng ${element.name} vào xem lai chim nha`, () => {});
  } else if (_.get(element, 'type') === 'comment') {
    runSpeaking(`${element.name} bình luận là ${element.comment}`, () => {});
  }
}
function autoScrollBottom(params) {
  if (sessionStorage.getItem('scroll')) {
    let scElm = document.getElementById('container-scroll');
    scElm.scrollTop = scElm.scrollHeight;
  }
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

function scrollBottom() {
  if (sessionStorage.getItem('scroll')) {
    sessionStorage.removeItem('scroll');
    scrollActive();
  } else {
    sessionStorage.setItem('scroll', 'true');
    scrollActive();
  }
}
// document.getElementById('mc-img').src = `${URL_API}/images/mc1.gif`;

