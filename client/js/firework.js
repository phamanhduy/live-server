
 // Khi người dùng click vào trang, tạo hiệu ứng nổ pháo chúc mừng
  function getCongraguation () {
    var audio4 = new Audio('https://assets.mixkit.co/active_storage/sfx/2993/2993-preview.mp3');
    audio4.volume = 0.2;
    audio4.play();
 };

 function audioChungMung() {
    // Lấy tọa độ của sự kiện click
    var audio = new Audio('https://assets.mixkit.co/active_storage/sfx/610/610-preview.mp3');
    var audio2 = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
    audio.volume = 0.5;
    audio2.volume = 0.5;
    audio.play();
    audio2.play();
}