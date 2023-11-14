var loadingPage = false;
var userData = null;

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

function connectionTiktok() {
  if (sessionStorage.getItem('user')) {
    userData = JSON.parse(sessionStorage.getItem('user'));
    loadingPage = true;
    loadingPageFun(loadingPage);
    socket.on(`${userData?.channel}`, (dataLive) => {
      receivedMessage(dataLive)
    });

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

setTimeout(() => {
  getUserSecsion();
  connectionTiktok(userData);
  loadingPageFun(loadingPage);
  loadingPageData();
  getCamera();
}, 500);

function getCamera() {
 if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      var constraints = {
        video: {
          width: { ideal: 720 },     // Ideal width
          height: { ideal: 720 },     // Ideal height
          facingMode: 'environment',  // Use the rear camera (use 'user' for the front camera)
          focusMode: { ideal: 'continuous' } // Set focus mode to continuous
        }
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          var video = document.getElementById('myVideo');
          video.srcObject = stream;
        })
        .catch(function (error) {
          console.error('Error accessing the camera: ', error.name, error.message);
        });
    } else {
      console.error('getUserMedia is not supported in this browser');
    }
}

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
  let openInv = document.querySelector('#inventory');
  openInv.style.display = 'none';
}

function receivedMessage(dataLive) {
  if (_.get(dataLive, 'type') === 'view') {
    showNumberViewer(dataLive);
  } else if (_.get(dataLive, 'type') === 'comment') {
    if (sessionStorage.getItem('winner')) {
      return;
    }
    caculator(dataLive);
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
  let rankingArr = new Array(30).fill({
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
  var group1 = rankingArr.slice(0, 10);
  var group2 = rankingArr.slice(10, 20);
  var group3 = rankingArr.slice(20, 30);
  
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
                <span><strong>${elmItem.name.length > 7 ? `${elmItem.name.slice(0, 7)}..` : elmItem.name}</strong></span>
              </div>
            </div>
          </td>
          <td>
            <div class="side right">
              <div><strong>${elmItem.score}</strong></div>
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

// document.getElementById('mc-img').src = `${URL_API}/images/mc1.gif`;

