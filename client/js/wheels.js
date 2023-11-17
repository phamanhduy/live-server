let dataExample = [
  {
    "_id": "65535c81f8129af36c687bd5",
    "userId": "65535c81f8129af36c687bd2",
    "channel": "minhtay6868",
    "sessionName": "11111111111",
    "score": 23,
    "followed": false,
    "createdAt": "2023-11-14T11:39:45.284Z",
    "updatedAt": "2023-11-14T11:40:32.181Z",
    "__v": 0,
    "user": [
      {
        "_id": "65535c81f8129af36c687bd2",
        "name": "FC  A7 Việt Nam",
        "username": "a7_123321",
        "avatar": "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/303a35c5177de389870228d58cb612f3~c5_100x100.webp?x-expires=1700132400&x-signature=Jwh6HMMwT1SfArv835shQPrxWi4%3D",
        "createdAt": "2023-11-14T11:39:45.278Z",
        "updatedAt": "2023-11-14T11:39:45.278Z",
        "__v": 0
      }
    ]
  },
  {
    "_id": "65535c51f8129af36c687b83",
    "userId": "65535c51f8129af36c687b80",
    "channel": "minhtay6868",
    "sessionName": "11111111111",
    "score": 22,
    "followed": true,
    "createdAt": "2023-11-14T11:38:57.760Z",
    "updatedAt": "2023-11-14T11:39:13.863Z",
    "__v": 0,
    "user": [
      {
        "_id": "65535c51f8129af36c687b80",
        "name": "Lê Thị Ngọc Trang",
        "username": "ngoc_trang47",
        "avatar": "https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/df27fb28d8a53df2e64763eba879fe59.webp?x-expires=1700132400&x-signature=2135kRSxuvGqz0rAwnQoiVxdesM%3D",
        "createdAt": "2023-11-14T11:38:57.751Z",
        "updatedAt": "2023-11-14T11:38:57.751Z",
        "__v": 0
      }
    ]
  },
  {
    "_id": "65535c51f8129af36c687b83",
    "userId": "65535c51f8129af36c687b80",
    "channel": "minhtay6868",
    "sessionName": "11111111111",
    "score": 44,
    "followed": true,
    "createdAt": "2023-11-14T11:38:57.760Z",
    "updatedAt": "2023-11-14T11:39:13.863Z",
    "__v": 0,
    "user": [
      {
        "_id": "65535c51f8129af36c687b80",
        "name": "Lê thanh sonw",
        "username": "ngoc_trang47",
        "avatar": "https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/df27fb28d8a53df2e64763eba879fe59.webp?x-expires=1700132400&x-signature=2135kRSxuvGqz0rAwnQoiVxdesM%3D",
        "createdAt": "2023-11-14T11:38:57.751Z",
        "updatedAt": "2023-11-14T11:38:57.751Z",
        "__v": 0
      }
    ]
  },
]
//Thông số vòng quay
$('.cap').html(htmlIcon);
let audio = new Audio('./audio/tick.mp3');

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var dataWheels = [];

/**
 * Prize data will space out evenly on the deal wheel based on the amount of items available.
 * @param text [string] name of the prize
 * @param color [string] background color of the prize
 * @param reaction ['resting' | 'dancing' | 'laughing' | 'shocked'] Sets the reaper's animated reaction
 */

const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");
const reaper = wheel.querySelector(".grim-reaper");

const spinClass = "is-spinning";
const selectedClass = "selected";

const spinnerStyles = window.getComputedStyle(spinner);
let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;

function convertDataToWheels(data) {
  let dataArray = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.score > 0) {
      dataArray.push({
        id: i,
        score: _.get(item, 'score', 0),
        text: _.get(item, 'score', 0) === 0 ? '' : _.get(item, 'user.0.name'),
        image: 'https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg',
        color: getRandomColor(),
      })
    }
  }
  dataWheels = dataArray;
  return dataArray;
}

function sumScore(dataWheels) {
  let totalscore = 0;
  for (let i = 0; i < dataWheels.length; i++) {
    const elm = dataWheels[i];
    totalscore += elm.score;
  }
  return totalscore;
}

const createPrizeNodes = (dataWheels) => {
  let totalRotation = 0;
  dataWheels.map(({ text, color, reaction, image, id, score }, i) => {

    let percenItem = (score / sumScore(dataWheels)) * 100;
    let numberOfRournd = ((percenItem / 100) * 360);
    totalRotation += numberOfRournd;
    let prizeRotation = -(totalRotation - (numberOfRournd / 2));
    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize user_${id}" data-reaction=${reaction} style="--rotate: ${prizeRotation}deg">
            <img style='width: 25px' src='${image}' />
            <span class="text">${text}</span>
          </li>`
    );
  });
};

const createConicGradient = (dataWheels) => {
  let totalPercent = 0;
  let totalPercent1 = 100 - ((dataWheels[dataWheels.length - 1].score / sumScore(dataWheels)) * 100);
  console.log({totalPercent1})
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
          from -90deg,
          ${dataWheels.map(({ color, score, id, text }, i) => {
            totalPercent += ((score / sumScore(dataWheels)) * 100);
            console.log({totalPercent})
              // if (totalPercent === 100) {
              //   totalPercent = ((dataWheels[dataWheels.length - 1].score / sumScore(dataWheels)) * 100);
              //   console.log({totalPercent})
              // }

              return `${color} 0 ${(100 - totalPercent) == 0 ? totalPercent1 : (100 - totalPercent)}%`;
          }).reverse()
      }
      );`
  );
};


const setupWheel = (data) => {
  if (data) {
    dataWheels = convertDataToWheels(data);

  }
  createConicGradient(dataWheels);
  createPrizeNodes(dataWheels);
  prizeNodes = wheel.querySelectorAll(".prize");
};

const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function playSound() {
  audio.pause();
  audio.currentTime = 0;
  audio.volume = 0.5;
  audio.play();
}

const runTickerAnimation = () => {
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) rad += (2 * Math.PI);

  const angle = Math.round(rad * (180 / Math.PI));
  let selectedPrize = null;
  let cumulativePercentage = 0;

  const rotationPercentage = (angle / 360) * 100;

  for (let i = 0; i < dataWheels.length; i++) {
    const prize = dataWheels[i];
    const percentage = (prize.score / sumScore(dataWheels)) * 100;

    if (
      rotationPercentage >= cumulativePercentage &&
      rotationPercentage < cumulativePercentage + percentage
    ) {
      selectedPrize = prize;
      break;
    }

    cumulativePercentage += percentage;
  }

  if (selectedPrize) {
    if (currentSlice !== selectedPrize.id) {
      prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
      ticker.style.animation = "none";
      setTimeout(() => ticker.style.animation = null, 10);
      currentSlice = selectedPrize.id;
      playSound();
      prizeNodes[selectedPrize.id].classList.add(selectedClass);
    }
  }
  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const selectPrize = (rotation) => {
  let selectedPrize = null;
  let cumulativePercentage = 0;
  const rotationPercentage = (rotation / 360) * 100;
  for (let i = 0; i < dataWheels.length; i++) {
    const prize = dataWheels[i];
    const percentage = (prize.score / sumScore(dataWheels)) * 100;

    if (
      rotationPercentage >= cumulativePercentage &&
      rotationPercentage < cumulativePercentage + percentage
    ) {
      selectedPrize = prize;
      break;
    }

    cumulativePercentage += percentage;
  }

  if (selectedPrize) {
    prizeNodes[selectedPrize.id].classList.remove(selectedClass);
    setTimeout(() => {
      prizeNodes[selectedPrize.id].classList.add(selectedClass);
    }, 1000);
    reaper.dataset.reaction = prizeNodes[selectedPrize.id].dataset.reaction;
  }

};

trigger.addEventListener("click", () => {
  if (reaper.dataset.reaction !== "resting") {
    reaper.dataset.reaction = "resting";
  }

  trigger.disabled = true;
  rotation = Math.floor(Math.random() * 360 + spinertia(5000, 7000));
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation(rotation);
});

spinner.addEventListener("transitionend", (e) => {
  cancelAnimationFrame(tickerAnim);
  trigger.disabled = false;
  trigger.focus();
  rotation %= 360;
  selectPrize(rotation);
  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);
});

setupWheel(dataExample);
