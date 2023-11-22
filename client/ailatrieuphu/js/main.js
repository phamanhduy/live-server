var loadingPage = false;
var userData = null;
var viewerCount = 0;

const fullscreenElement = document.getElementById('fullscreenElement');
  // Hàm để bắt đầu chế độ toàn màn hình
  function openFullscreen() {
    if (fullscreenElement.requestFullscreen) {
      fullscreenElement.requestFullscreen();
    } else if (fullscreenElement.mozRequestFullScreen) { // Firefox
      fullscreenElement.mozRequestFullScreen();
    } else if (fullscreenElement.webkitRequestFullscreen) { // Chrome, Safari và Opera
      fullscreenElement.webkitRequestFullscreen();
    } else if (fullscreenElement.msRequestFullscreen) { // IE/Edge
      fullscreenElement.msRequestFullscreen();
    }
  }

  // Hàm để thoát khỏi chế độ toàn màn hình
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari và Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  }

function convertTextToVietnameseWords(text) {
    try {
        const result = text.replace(/\d+/g, match => {
            const number = parseInt(match, 10);
            return to_vietnamese(number);
        });
        return result;   
    } catch (error) {
        console.log({error});
    }
}

function convertVND(x = 1000) {
    return x.toLocaleString("it-IT", { style: "currency", currency: "VND" });
}

function getUserSecsion() {
    if (sessionStorage.getItem('user')) {
        userData = JSON.parse(sessionStorage.getItem('user'));
        $('#tongsotim').html(_.get(userData, 'tongsotim'));
        $('#sotim').html(_.get(userData, 'tongsotim'))
        $('#texthuongdan').html(_.get(userData, 'huongdan'));
        clearInterval(timerRuning);
        // startRunTimer(_.get(userData, 'maxNumber'));
        getRanking();
        if (!_.isEmpty(_.get(userData, 'linkVideo'))) {
            try {
                $('#myVideo').attr('src', _.get(userData, 'linkVideo'));
                stopCamera();   
            } catch (error) {
              console.log({error});  
            }
        } else {
            getCamera('user');
        }
    }
}

var URL_API = _.get(JSON.parse(sessionStorage.getItem('user')), 'serverInput') || 'http://localhost:3000';
let connection = new TikTokIOConnection(URL_API);

var socket = io(URL_API);

function saveUserSecsion(isConnect = true) {
    const channel = document.getElementById('message-input');
    const maxNumber = document.getElementById('time-input');
    const sessionLive = document.getElementById('live-section');
    const serverInput = document.getElementById('server-input');
    const linkInput = document.getElementById('link_video');
    const timInput = document.getElementById('so_tim');
    const jsonProduct = document.getElementById('json_product');
    const idProduct = document.getElementById('id_product');
    const huongdan = document.getElementById('huongdan');
    // const startPlay = document.getElementById('start-play');
    sessionStorage.setItem('user', JSON.stringify({
        channel: channel.value,
        maxNumber: maxNumber.value,
        liveSession: sessionLive.value,
        serverInput: serverInput.value,
        linkVideo: linkInput.value,
        tongsotim: timInput.value,
        jsonProduct: jsonProduct.value,
        idProduct: idProduct.value,
        huongdan: huongdan.value,
    }));
    if (isConnect) {
        connectionTiktok();
    } else {
        setTimeout(() => {
            getUserSecsion();
        }, 500);
    }
    closeInventory();
}

function changeBanhxe() {
    var valueOpacity = $('#hienthibanhxe').val();
    $('.deal-wheel').css("opacity", valueOpacity);    
}

function hienthivideo() {
    var valueOpacity = $('#hienthivideo').val();
    $('#myVideo').css("opacity", valueOpacity);    
}

function toanmanhinh() {
    var valueOpacity = $('#toanmanhinh').val();
    if (valueOpacity == '0') {
        openFullscreen()
    } else {
        closeFullscreen();
    }
}

function connectionTiktok() {
    if (sessionStorage.getItem('user')) {
        userData = JSON.parse(sessionStorage.getItem('user'));
        loadingPageFun(loadingPage);
        getRanking();

        let uniqueId = userData?.channel;
        if (uniqueId !== '') {
            connection.connect(uniqueId, {
                enableExtendedGiftInfo: true,
                ...userData,
            }).then(state => {
                console.log(`Connected to roomId ${userData?.channel}`);
            }).catch(errorMessage => {
                // schedule next try if obs username set
                setTimeout(() => {
                    // connectionTiktok();
                }, 30000);
            });
            
            connection.on(`${userData?.channel}-chat`, (dataLive) => {
                if (!isSpeaking) {
                    console.log(`${dataLive.nickname} đang nói: ${dataLive.comment}`);
                    runSpeaking(convertTextToVietnameseWords(dataLive.comment), (data) => {
                    });
                }
            });
            // connection.on(`${userData?.channel}-like`, (dataLive) => {
            //     let tongsotim = parseInt(_.get(userData, 'tongsotim'));
            //     let likes = _.isNull(sessionStorage.getItem('likes')) ? 0 : parseInt(sessionStorage.getItem('likes'));
            //     if (!isSpinnig) {
            //         if (likes < tongsotim) {
            //             likes += dataLive?.likeCount;
            //             sessionStorage.setItem('likes', likes);
            //             $('#sotim').html(tongsotim - likes)
            //         }
            //     }
            //     if (likes >= tongsotim) {
            //         if (!isSpinnig) {
            //             runWheel();
            //             sessionStorage.setItem('likes', '0');
            //             $('#sotim').html(0);
            //         }
            //     }
            // });
        
            // connection.on(`${userData?.channel}-views`, (dataLive) => {
            //     if (typeof dataLive.viewerCount === 'number') {
            //         viewerCount = dataLive.viewerCount;
            //         updateRoomStats(dataLive.viewerCount);
            //     }
            // })
            connection.on(`${userData?.channel}-ranking`, (dataLive) => {
                showRanking(_.get(dataLive, 'ranking'));
            });

            connection.on(`${userData?.channel}-gift`, (dataLive) => {
                caculatorScore(dataLive);
            });
        } else {
            alert('no username entered');
        }
    }
}

function caculatorScore(data) {
    let game = JSON.parse(sessionStorage.getItem('play'));
    if (game && score[_.get(data, 'giftName')] == _.get(game, 'answer')) {
        console.log({winner: {
            username: _.get(data, 'uniqueId'),
        }, userData, coinReceived: _.get(data, 'diamondCount')})
        connection.emit('send_coin', {winner: {
            username: _.get(data, 'uniqueId'),
        }, userData, coinReceived: _.get(data, 'diamondCount')});
    }
}
function receivedMessage(userData) {
}

function updateRoomStats(views) {
    let numberMoney = convertVND((views * 1000) / 2);
    $('#money').html(numberMoney);
}

connection.on('streamEnd', () => {
    console.log('Stream ended.');
    if (sessionStorage.getItem('user')) {
        userData = JSON.parse(sessionStorage.getItem('user'));
        // schedule next try if obs username set
        if (userData?.channel) {
            setTimeout(() => {
                connect(userData?.channel);
            }, 30000);
        }
    }
})

setTimeout(() => {
    getUserSecsion();
    // connectionTiktok(userData);
    loadingPageFun(loadingPage);
    loadingPageData();
    // getCamera();
}, 500);

function getCamera(facingMode = 'facingMode') {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        var constraints = {
            video: {
                facingMode: facingMode,  // Use the rear camera (use 'user' for the front camera)
                focusMode: { ideal: 'continuous' }, // Set focus mode to continuous
            }
        };

        var video = document.getElementById('myVideo'); // Assuming you have a video element with id 'myVideo'
        var stream;

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (mediaStream) {
                stream = mediaStream;
                video.srcObject = stream;
            })
            .catch(function (error) {
                console.error('Error accessing the camera: ', error.name, error.message);
            });

        // Add a function to stop the camera stream
        window.stopCamera = function() {
            if (stream) {
                var tracks = stream.getTracks();
                tracks.forEach(function(track) {
                    track.stop();
                });
                video.srcObject = null;
            }
        };
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
        const linkInput = document.getElementById('link_video');
        const timInput = document.getElementById('so_tim');
        const jsonProduct = document.getElementById('json_product');
        const idProduct = document.getElementById('id_product');
        const huongdan = document.getElementById('huongdan');

        channel.value = userData?.channel;
        maxNumber.value = userData?.maxNumber;
        sessionLive.value = userData?.liveSession;
        serverInput.value = userData?.serverInput;
        linkInput.value = userData?.linkVideo;
        timInput.value = userData?.tongsotim;
        jsonProduct.value = userData?.jsonProduct;
        idProduct.value = userData?.idProduct;
        huongdan.value = userData?.huongdan;
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
        fetch(`${URL_API}/api/get-ranking-altp?session=${userData?.liveSession}`, {
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
    // if (!isSpinnig) {
    //     setupWheel(data);
    // }
    sessionStorage.setItem('ranking', JSON.stringify(data));
    let avatar = 'https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg';
    let rankingArr = new Array(30).fill({
        avatar,
        name: null,
        score: 0,
    });
    _.assign(rankingArr, _.map(data, (d, i) => {
        return {
            avatar: _.get(d, 'user.0.avatar'),
            name: _.get(d, 'user.0.name'),
            score: d.score
        }
    }));
    let tongDiem = rankingArr.reduce(function (total, r) {
        return total + r.score;
    }, 0);
    rankingArr = _.orderBy(rankingArr, ['score'], ['desc']).map((d, i) => ({
        avatar: _.get(d, 'avatar'),
        name: _.get(d, 'name') || `Top${i + 1}`,
        score: d.score
    }));
    // var group1 = rankingArr.slice(0, 5);
    // var group2 = rankingArr.slice(5, 10);
    // var group3 = rankingArr.slice(10, 15);

    var group1 = rankingArr.slice(0, 6);
    var group2 = rankingArr.slice(6, 12);
    var group3 = rankingArr.slice(12, 18);

    var groups = [group1, group2, group3];
    let html = '';
    for (let i = 0; i < groups.length; i++) {
        let elm = groups[i];
        let htmlItem = '';
        for (let e = 0; e < elm.length; e++) {
            let elmItem = elm[e];
            let percen = (elmItem.score / tongDiem) * 100;
            let titleName = elmItem.name.length > 7 ? `${elmItem.name.slice(0, 7)}` : elmItem.name;
            htmlItem += `<tr>
          <td style="margin-right: 5px;">
            <img class="raking-avatar" src='${elmItem.avatar}'>
          </td>
          <td style="width: 60px">
            <div class="bar-container">
              <div style='width: ${percen}%' class="bar-${i + 1}">
                <span><strong title='${elmItem.name}'>${titleName}</strong></span>
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

