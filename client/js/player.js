
let dungeon = {
    rating: 500,
    grade: "E",
    progress: {
        floor: 1,
        room: 1,
        floorLimit: 100,
        roomLimit: 5,
    },
    settings: {
        enemyBaseLvl: 1,
        enemyLvlGap: 5,
        enemyBaseStats: 1,
        enemyScaling: 1.1,
    },
    status: {
        exploring: false,
        paused: true,
        event: false,
    },
    statistics: {
        kills: 0,
        runtime: 0,
    },
    backlog: [],
    action: 0,
};


// Lấy các phần tử DOM
const imageContainer = document.querySelector('.image-container');
const guessInput = document.getElementById('guess');
const submitButton = document.getElementById('submit');
const resultText = document.getElementById('result');

// Tạo một đối tượng chứa thông tin của trò chơi
const game = {
  image: 'https://e.gamevui.vn/web/2014/10/batchu/assets/pics/xygl-vygl.jpg', // Tên tệp hình ảnh
  word: 'javascript', // Từ cần đoán
  guesses: [], // Các ký tự đã đoán
  maxGuesses: 10, // Số lần đoán tối đa
  remainingGuesses: 10, // Số lần đoán còn lại
  started: false, // Trạng thái của trò chơi
  ended: false // Trạng thái của trò chơi
};

// Hiển thị hình ảnh trên trang web
imageContainer.innerHTML = `<img class="zoom-in-out-box" src="${game.image}" alt="Hình ảnh">`;