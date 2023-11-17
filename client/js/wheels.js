
  //Thông số vòng quay
  $('.cap').html(htmlIcon)
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

  let dataWheels = [
    {
        "id": 0,
        core: 481,
        "text": "Xin chào 0",
        "color": getRandomColor(),
        "image": "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
        "reaction": "dancing"
    },
    {
        "id": 1,
        core: 485,
        "text": "Xin chào 1",
        "color": getRandomColor(),
        "image": "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
        "reaction": "dancing"
    },
    {
        "id": 2,
        core: 486,
        "text": "Xin chào 2",
        "color": getRandomColor(),
        "image": "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
        "reaction": "dancing"
    },
    {
        "id": 3,
        core: 2000,
        "text": "Xin chào 3",
        "color": getRandomColor(),
        "image": "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
        "reaction": "dancing"
    },
    {
        "id": 4,
        core: 564,
        "text": "Xin chào 4",
        "color": getRandomColor(),
        "image": "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
        "reaction": "dancing"
    },
    {
      "id": 5,
      core: 569,
      "text": "Xin chào 5",
      "color": getRandomColor(),
      "image": "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
      "reaction": "dancing"
  },
  {
    "id": 6,
    core: 664,
    "text": "Xin chào 6",
    "color": getRandomColor(),
    "image": "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    "reaction": "dancing"
},
{
  "id": 7,
  core: 769,
  "text": "Xin chào 7",
  "color": getRandomColor(),
  "image": "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
  "reaction": "dancing"
},
{
  "id": 8,
  core: 869,
  "text": "Xin chào 8",
  "color": getRandomColor(),
  "image": "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
  "reaction": "dancing"
},
];

  // for (let i = 0; i < 31; i++) {
  //   dataWheels.push({
  //     id: i,
  //     text: `Xin chào ${i}`,
  //     color: getRandomColor(),
  //     image: 'https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg',
  //     reaction: "dancing"
  //   });
  // }

  console.log({dataWheels})
    /**
 * Prize data will space out evenly on the deal wheel based on the amount of items available.
 * @param text [string] name of the prize
 * @param color [string] background color of the prize
 * @param reaction ['resting' | 'dancing' | 'laughing' | 'shocked'] Sets the reaper's animated reaction
 */
    const prizes = dataWheels;
    
    const wheel = document.querySelector(".deal-wheel");
    const spinner = wheel.querySelector(".spinner");
    const trigger = wheel.querySelector(".btn-spin");
    const ticker = wheel.querySelector(".ticker");
    const reaper = wheel.querySelector(".grim-reaper");
    const prizeSlice = 360 / prizes.length;
    const prizeOffset = Math.floor(180 / prizes.length);
    const spinClass = "is-spinning";
    const selectedClass = "selected";
    const spinnerStyles = window.getComputedStyle(spinner);
    let tickerAnim;
    let rotation = 0;
    let currentSlice = 0;
    let prizeNodes;

    

    let totalCore = 0;
    let totalPercent = 0;
    let prizeRotation1 = 0;
    for (let i = 0; i < dataWheels.length; i++) {
      const elm = dataWheels[i];
      totalCore+= elm.core;
    }
    
    // const createPrizeNodes = (data) => {
    //   if (data) {
    //     dataWheels = data;
    //   }
    //   dataWheels.forEach(({ text, color, reaction }, i) => {
    //     const rotation = ((prizeSlice * i) * -1) - prizeOffset;
    //     console.log({rotation})
    //     spinner.insertAdjacentHTML(
    //       "beforeend",
    //       `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg">
    //         <span class="text">${text}</span>
    //       </li>`
    //     );
    //   });
    // };
    
    // const createConicGradient = () => {
    //   spinner.setAttribute(
    //     "style",
    //     `background: conic-gradient(
    //       from -90deg,
    //       ${dataWheels
    //         .map(({ color }, i) => {
    //           console.log((100 / dataWheels.length) * (dataWheels.length - i))
    //           return `${color} 0 ${(100 / dataWheels.length) * (dataWheels.length - i)}%`
    //         })
    //         .reverse()
    //       }
    //     );`
    //   );
    // };
    
    

    const createPrizeNodes = (data) => {
      radianArr = [];
      if (data) {
        dataWheels = data;
      }
      let totalRotation = 0;
      dataWheels.map(({ text, color, reaction, image, id, core }, i) => {

        let percenItem = (core / totalCore) * 100;
        let numberOfRournd = ((percenItem / 100) * 360);
        totalRotation += numberOfRournd;
        let prizeRotation =  -(totalRotation - (numberOfRournd / 2));

        prizeRotation1 = prizeRotation
        spinner.insertAdjacentHTML(
          "beforeend",
          `<li class="prize user_${id}" data-reaction=${reaction} style="--rotate: ${prizeRotation}deg">
            <img style='width: 25px' src='${image}' />
            <span class="text">${text}</span>
          </li>`
        );
      });
    };

    const createConicGradient = () => {
      spinner.setAttribute(
        "style",
        `background: conic-gradient(
          from -90deg,
          ${dataWheels
            .map(({ color, core, id, text }, i) => {
              // const elm = dataWheels[(dataWheels.length - 1) - i];
              // console.log({elm})
              let percenItem = (core / totalCore) * 100
              totalPercent += percenItem;
              console.log(100 - totalPercent)
              return `${color} 0 ${100 - totalPercent}%`;
            }).reverse()
          }
        );`
      );
    };

    
    const setupWheel = (data) => {
      createConicGradient(data);
      createPrizeNodes(data);
      prizeNodes = wheel.querySelectorAll(".prize");
    };
    
    const spinertia = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
      //Tạo âm thanh và tải tập tin tick.mp3.
  let audio = new Audio('./audio/tick.mp3');
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
    
      // Convert rotation to a percentage of the total wheel rotation
      const rotationPercentage = (angle / 360) * 100;
    
      for (let i = 0; i < prizes.length; i++) {
        const prize = prizes[i];
        const percentage = (prize.core / totalCore) * 100;
    
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
      for (let i = 0; i < prizes.length; i++) {
        const prize = prizes[i];
        const percentage = (prize.core / totalCore) * 100;
    
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
    
    setupWheel(null);
