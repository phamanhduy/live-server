
 // Khi người dùng click vào trang, tạo hiệu ứng nổ pháo chúc mừng
  function getCongraguation () {

    // Lấy tham chiếu đến canvas
    var canvas;
    if (!document.getElementById('canvas')) {
        canvas = document.createElement('canvas');
        canvas.id = "canvas";
        document.body.appendChild(canvas);
    } else {
        canvas = document.getElementById('canvas');
    }
 var ctx = canvas.getContext('2d');

 // Thiết lập kích thước của canvas bằng kích thước của cửa sổ trình duyệt
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;

 // Tạo một hàm để vẽ pháo hoa
 function drawFirework(x, y, color) {
     // Tạo mảng các hạt pháo hoa
     var particles = [];

     // Thiết lập số lượng hạt pháo hoa
     var particleCount = 150;

     // Tạo các hạt pháo hoa
     for (var i = 0; i < particleCount; i++) {
         // Tạo hạt pháo hoa
         var particle = {
             x: x,
             y: y,
             speed: Math.random() * 4 + 1,
             direction: Math.random() * Math.PI * 2,
             radius: Math.random() * 2 + 1,
             color: color,
             opacity: 1
         };

         // Thêm hạt pháo hoa vào mảng
         particles.push(particle);
     }

     // Vẽ các hạt pháo hoa
     function draw() {
         // Xóa canvas
         ctx.clearRect(0, 0, canvas.width, canvas.height);

         // Vẽ các hạt pháo hoa
         for (var i = 0; i < particles.length; i++) {
             var particle = particles[i];

             ctx.beginPath();
             ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
             ctx.fillStyle = 'rgba(' + particle.color + ',' + particle.opacity + ')';
             ctx.fill();

             // Cập nhật tọa độ của hạt pháo hoa
             particle.x += Math.cos(particle.direction) * particle.speed;
             particle.y += Math.sin(particle.direction) * particle.speed;
             particle.opacity -= 0.01;

             // Xóa hạt pháo hoa khỏi mảng khi nó mất điện độ opacity
             if (particle.opacity <= 0) {
                 particles.splice(i, 1);
             }
         }
     }

     // Lặp lại vẽ các hạt pháo hoa
     var interval = setInterval(function () {
         draw();

         // Dừng lặp lại khi tất cả các hạt pháo hoa đã mất điện độ opacity
         if (particles.length === 0
         ) {
             clearInterval(interval);
         }
     }, 30);
 }

var audio4 = new Audio('https://assets.mixkit.co/active_storage/sfx/2993/2993-preview.mp3');
audio4.volume = 0.2;
audio4.play();

// Lấy chiều rộng của cửa sổ trình duyệt
var windowWidth = window.innerWidth;
// Lấy chiều cao của cửa sổ trình duyệt
var windowHeight = window.innerHeight;
// Tính toán giá trị tọa độ x và y của trung tâm của trang web
var x = windowWidth / 2;
var y = windowHeight / 2;

     // Tạo một mảng các màu sắc để sử dụng cho các hạt pháo hoa
     var colors = [
         '255, 51, 102',
         '255, 153, 0',
         '255, 255, 0',
         '0, 153, 255',
         '102, 255, 51'
     ];

     // Tạo các pháo hoa ngẫu nhiên
     for (var i = 0; i < 5; i++) {
         var colorIndex = Math.floor(Math.random() * colors.length);
         var color = colors[colorIndex];

         drawFirework(x, y, color);
     }
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