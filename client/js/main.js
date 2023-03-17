let loadingPage = false;
let userData = null;

function getUserSecsion() {
  if (sessionStorage.getItem('user')) {
    userData = JSON.parse(sessionStorage.getItem('user'));
  }
}

function saveUserSecsion() {
    const channel = document.getElementById('message-input');
    const maxNumber = document.getElementById('time-input');
    const sessionLive = document.getElementById('live-section');
    sessionStorage.setItem('user', JSON.stringify({
      channel: channel.value,
      maxNumber: maxNumber.value,
      liveSession: sessionLive.value,
    }));
    setTimeout(() => {
      getUserSecsion();
      connectionTiktok();
    }, 500);
}

function connectionTiktok() {
  if (sessionStorage.getItem('user')) {
    userData = JSON.parse(sessionStorage.getItem('user'));
    loadingPage = true;
    loadingPageFun(loadingPage);
    socket.on(`${userData?.channel}`, (dataLive) => {
      receivedMessage(dataLive)
    });
    getRanking()
    socket.on(`${userData?.channel}-ranking`, (dataLive) => {
      sessionStorage.setItem('ranking', JSON.stringify(_.get(dataLive, 'ranking')))
      sessionStorage.setItem('sessionWinner', JSON.stringify(_.get(dataLive, 'sessionWinner')))
    });
    closeInventory();
  }
}

setTimeout(() => {
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
    channel.value = userData?.channel;
    maxNumber.value = userData?.maxNumber;
    sessionLive.value = userData?.liveSession;
    document.getElementById('player-name').innerHTML = `@${userData?.channel.length > 8 ? `${userData?.channel.slice(0, 8)}...` : userData?.channel}`
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
      if (_.includes(comment, gameWord) && !sessionStorage.getItem('winner')) {
        sessionStorage.setItem('winner', JSON.stringify(dataLive));
        saveSpeaking('congratulation', SON.stringify(dataLive))
        socket.emit(`score-winner`, {
          ...dataLive,
          liveSession: userData?.liveSession
        });
      }
    }
  }
}

// setTimeout(() => {
//   socket.emit(`score-winner`, {
//     "channel": "kimnguyenbentre",
//     "name": "bhaktithapa705",
//     "username": "",
//     "avatar": "https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/db0440e41cf1a34f2bfdd5491bd4239a~tplv-tiktok-shrink:72:72.webp?x-expires=1678194000&x-signature=lUfS688Yafhk2fvFowHuRQpISYM%3D",
//     "comment": "vry good",
//   });
// }, 5000);

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
  let rankingArr = [{
    avatar: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    name: 'Chưa có 4i',
    score: 4,
  }, {
    avatar: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    name: 'Chưa có ai',
    score: 2,
  }, {
    avatar: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    name: 'Chưa có ai',
    score: 0,
  }, {
    avatar: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    name: 'Chưa có ai',
    score: 3,
  }];
  _.assign(rankingArr, _.map(data, d => {
    return {
      avatar: _.get(d, 'user.0.avatar'),
      name: _.get(d, 'user.0.name'),
      score: _.get(d, 'score')
    }
  }))
  let tongDiem = rankingArr.reduce(function(total, r) {
    return total + r.score;
  }, 0);

  rankingArr = _.orderBy(rankingArr, ['score'], ['desc'])
  let html = '';
  for (let i = 0; i < rankingArr.length; i++) {
    const elm = rankingArr[i];
    let percen = (elm.score / tongDiem) * 100;
    html += `<tr>
    <td style="margin-right: 5px;">
      <img class="raking-avatar" src='${elm.avatar}'>
    </td>
    <td style="width: 200px">
      <div class="bar-container">
        <div style='width: ${percen}%' class="bar-${i + 1}">
          <span>${elm.name}</span>
        </div>
      </div>
    </td>
    <td>
      <div class="side right">
        <div>${elm.score}</div>
      </div>
    </td>
  </tr>`
  }
  document.getElementById('ranking').innerHTML = html;
}