let loadingPage = false;
let userData = null;

function getUserSecsion() {
  if (sessionStorage.getItem('user')) {
    userData = JSON.parse(sessionStorage.getItem('user'));
  }
}

function saveUserSecsion() {
    const username = document.getElementById('message-input');
    const maxNumber = document.getElementById('time-input');
    sessionStorage.setItem('user', JSON.stringify({
      username: username.value,
      maxNumber: maxNumber.value
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
    socket.emit(`connect_user`, userData?.username);
    closeInventory();
  }
}

setTimeout(() => {
  getUserSecsion();
  if (userData) {
    socket.on(`connect-success-${userData?.username}`, (data) => {
      if (data?.channel === userData?.username) {
        loadingPage = false;
        loadingPageFun(loadingPage);
      }
    });
  }
  connectionTiktok();
  loadingPageFun(loadingPage);
  loadingPageData();
  receivedMessage();
}, 500);

function loadingPageData() {
  if (userData) {
    const username = document.getElementById('message-input');
    const maxNumber = document.getElementById('time-input');
    username.value = userData?.username;
    maxNumber.value = userData?.maxNumber;
    document.getElementById('player-name').innerHTML = `@${userData?.username.length > 8 ? `${userData?.username.slice(0, 8)}...` : userData?.username}`
  } 
}
function loadingPageFun(loading) {
  if (loading) {
    document.getElementById('loading').style.display = 'block';
  } else {
    document.getElementById('loading').style.display = 'none';
  }
}

// Opens inventory
const openInventory = () => {
  let openInv = document.querySelector('#inventory');
  openInv.style.display = "flex";
}

// Closes inventory
const closeInventory = () => {
  let openInv = document.querySelector('#inventory');
  openInv.style.display = "none";
}

function receivedMessage() {
    if (userData) {
      socket.on(`chat-${userData?.username}`, data => {
        console.log('chat', {data})
      });
      socket.on(`member-${userData?.username}`, data => {
        console.log('member', {data})
      });
      socket.on(`gift-${userData?.username}`, data => {
        console.log('gift', {data})
      });
      socket.on(`roomUser-${userData?.username}`, data => {
        document.getElementById('viewers').innerHTML = _.get(data, 'viewerCount');
      });
      socket.on(`like-${userData?.username}`, data => {
        console.log('like', {data})
      });
      socket.on(`social-${userData?.username}`, data => {
        console.log('social', {data})
      });
      socket.on(`emote-${userData?.username}`, data => {
        console.log('emote', {data})
      });
      socket.on(`envelope-${userData?.username}`, data => {
        console.log('envelope', {data})
      });
      socket.on(`questionNew-${userData?.username}`, data => {
        console.log('questionNew', {data})
      });
      socket.on(`subscribe-${userData?.username}`, data => {
        console.log('subscribe', {data})
      });
      socket.on(`follow-${userData?.username}`, data => {
        console.log('follow', {data})
      });
      socket.on(`share-${userData?.username}`, data => {
        console.log('share', {data})
      });
    }
}