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
    // const startPlay = document.getElementById('start-play');
    sessionStorage.setItem('user', JSON.stringify({
      channel: channel.value,
      maxNumber: maxNumber.value,
      liveSession: sessionLive.value,
      // startPlay: startPlay.value,
    }));
    setTimeout(() => {
      getUserSecsion();
      connectionTiktok();
    }, 500);
    socket.emit(`connect-tiktok`, {
      channel: userData?.channel,
      liveSession: userData?.liveSession
    });
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
      sessionStorage.setItem('ranking', JSON.stringify(_.get(dataLive, 'ranking')));
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
}, 500);

function loadingPageData() {
  if (userData) {
    const channel = document.getElementById('message-input');
    const maxNumber = document.getElementById('time-input');
    const sessionLive = document.getElementById('live-section');
    // const startPlay = document.getElementById('start-play');
    channel.value = userData?.channel;
    maxNumber.value = userData?.maxNumber;
    sessionLive.value = userData?.liveSession;
    // startPlay.value = userData?.startPlay;
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
    if (!sessionStorage.getItem('winner')) {
      caculator(dataLive);
    }
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
        // saveSpeaking('congratulation', dataLive)
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
          <td style="width: 90px">
            <div class="bar-container">
              <div style='width: ${percen}%' class="bar-${i + 1}">
                <span>${elmItem.name.length > 10 ? `${elmItem.name.slice(0, 10)}..` : elmItem.name}</span>
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

// document.getElementById('mc-img').src = `${URL_API}/images/mc1.gif`;

