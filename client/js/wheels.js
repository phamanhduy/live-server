
//Thông số vòng quay
// $('.cap').html(htmlIcon);

setInterval(() => {
  caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))))
}, 60000);

var audio = new Audio('./audio/tick.mp3');
var audioChecknon = new Audio('./audio/audo_chiecnonkydieu.mp3');
var isSpinnig = false;
let selectedPrize = null;

function playSoundBackground() {
  if (isSpinnig) {
    playSound(audioChecknon);
    audioChecknon.addEventListener('ended', function () {
      playSoundBackground();
    });
  }
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function playSound(audio, option = {volume: 0.5, currentTime: 0}) {
  audio.pause();
  audio.currentTime = option.currentTime;
  audio.volume = option.volume;
  audio.play().catch(error => {});
}

var dataWheels = new Array();

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
        username: _.get(item, 'user.0.username'),
        score: _.get(item, 'score', 0),
        text: _.get(item, 'score', 0) === 0 ? '' : _.get(item, 'user.0.name'),
        image: _.get(item, 'user.0.avatar'),
        color: getRandomColor(),
      })
    }
  }
  dataWheels = dataArray;
  return dataWheels;
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
  spinner.innerHTML = '';
  let totalRotation = 0;
  dataWheels.map(({ text, color, reaction, image, id, score }, i) => {

    let percentItem = (score / sumScore(dataWheels)) * 100;
    let percentTotation = ((percentItem / 100) * 360);
    totalRotation += percentTotation;
    let prizeRotation = (totalRotation - (percentTotation / 2));

    // const maxNumber = _.maxBy(dataWheels, 'score').score;
    // let maxPercent = (maxNumber / sumScore(dataWheels)) * 100;
    // let fontSize = percentItem * (15 / maxPercent);

    let fontSize = 15;
    if (percentItem < 5) {
      fontSize = 12;
    }

    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize user_${id}" data-reaction=${reaction} style="--rotate: ${prizeRotation}deg">
            <img style='width: 25px' src='${image}' />
            <span class="text" style='font-size: ${fontSize.toFixed(0)}px'>${text}</span>
          </li>`
    );
  });
};

const createConicGradient = (dataWheels) => {
  let totalPercent = 0;
  spinner.removeAttribute("style");
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
          from -90deg,
          ${dataWheels.map(({ color, score, id, text }, i) => {
            totalPercent += ((score / sumScore(dataWheels)) * 100);
              return `${color} 0 ${totalPercent}%`;
          })
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

const runTickerAnimation = () => {
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) rad += (2 * Math.PI);

  const angle = Math.round(rad * (180 / Math.PI));
  let cumulativePercentage = 0;

  const rotationPercentage = (angle / 360) * 100;

  for (let i = 0; i < dataWheels.length; i++) {
    const prize = dataWheels[(dataWheels.length - 1) - i];
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
      playSound(audio);
      prizeNodes[selectedPrize.id].classList.add(selectedClass);
      changeAvatar(selectedPrize);
    }
  }
  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

function changeAvatar(selectedPrize) {
  $(".cap img").attr("src", selectedPrize['image']);
  // $('.cap').html(selectedPrize['avatar']);
}

const selectPrize = (rotation) => {
  let cumulativePercentage = 0;
  const rotationPercentage = (rotation / 360) * 100;
  for (let i = 0; i < dataWheels.length; i++) {
    const prize = dataWheels[(dataWheels.length - 1) - i];
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
    // reaper.dataset.reaction = prizeNodes[selectedPrize.id].dataset.reaction;
  }

};

// trigger.addEventListener("click", () => {
//   isSpinnig = true;
//   // trigger.disabled = true;
//   rotation = Math.floor(Math.random() * 360 + spinertia(5000, 7000));
//   prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
//   wheel.classList.add(spinClass);
//   spinner.style.setProperty("--rotate", rotation);
//   ticker.style.animation = "none";
//   runTickerAnimation(dataWheels);
// });


function runWheel() {
  isSpinnig = true;
  // trigger.disabled = true;
  rotation = Math.floor(Math.random() * 360 + spinertia(4000, 5000));
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation(dataWheels);
  playSoundBackground();
}

spinner.addEventListener("transitionend", () => {
  cancelAnimationFrame(tickerAnim);
  // trigger.disabled = false;
  // trigger.focus();
  rotation %= 360;
  selectPrize(rotation);
  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  
  
  audioChecknon.pause();
  audioChecknon.currentTime = 0;
  ramdomNumber(() => {
    isSpinnig = false;
    runChungMung(selectedPrize)
  }, {timer: 15000})
});
