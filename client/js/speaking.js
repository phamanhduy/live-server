// tv360.vn
let isSpeaking = false;


// FunctionUtil
initSpeak('intro');

function initSpeak(type, data) {
  switch (type) {
    case 'intro':
      introGame();
      break;
    case 'congratulation':
      congratulationGame(data);
      break;
    case 'introProduct':
      introProduct(data);
      break;
    default:
      break;
  }
}

function introProduct() {
  let introArr = [
    "Các bạn thả tim thật nhiều để lên điểm nha, 5 tim 1 điểm, sẽ nhanh lên được top đầu thôi!",
    "Bạn có muốn tìm kiếm những sản phẩm độc đáo và thú vị? Hãy ghé qua giỏ hàng của chúng tôi ngay!",
    "Khám phá ngay giỏ hàng đầy đủ các sản phẩm chất lượng và đa dạng để lựa chọn cho mình những món hàng ưa thích nhất!",
    "Đến với giỏ hàng của chúng tôi, bạn sẽ có cơ hội tham quan và mua sắm những sản phẩm mới nhất và độc đáo nhất!",
    "Những món đồ độc đáo và hấp dẫn đang chờ đón bạn tại giỏ hàng của chúng tôi, hãy đến và khám phá ngay thôi!",
    "Bạn sẽ không thể bỏ qua những món hàng đặc biệt và hấp dẫn trong giỏ hàng của chúng tôi. Hãy ghé thăm ngay để trải nghiệm!",
    "Hãy khám phá ngay giỏ hàng đa dạng và phong phú của chúng tôi để tìm kiếm những sản phẩm ưng ý nhất cho mình!",
    "Đến với giỏ hàng của chúng tôi, bạn sẽ có cơ hội tìm thấy những món đồ độc đáo và hấp dẫn nhất, không thể tìm thấy ở bất kỳ đâu khác!",
    "Bạn sẽ không thể rời mắt khỏi những món đồ độc đáo và thú vị trong giỏ hàng của chúng tôi. Hãy đến và trải nghiệm ngay thôi!",
    "Những món hàng độc đáo và chất lượng tốt nhất đang chờ đón bạn trong giỏ hàng của chúng tôi. Hãy đến và khám phá ngay thôi!",
  ]
  runSpeaking(FunctionUtil.randomArr(introArr));
}

function congratulationGame(name, isTop = false) {
  // VNnum2words(10560)
  let introArr;
  if (isTop) {
    introArr = [
      `Chúc mừng ${name} đã đạt được vị trí top một! Hãy tiếp tục cố gắng và giữ vững vị trí này nhé!`,
      `OA, ${name} bạn làm tốt lắm! Vị trí top một chưa đủ, hãy tiếp tục thách thức bản thân và bảo vệ vị trí này`,
      `Cảm giác đứng đầu bảng xếp hạng là gì? Chắc chắn tuyệt vời lắm! Hãy tiếp tục giữ vững thành tích này và đánh bại các đối thủ tiếp theo`,
      `Xin chúc mừng ${name}, vị trí top một là thành quả xứng đáng cho sự nỗ lực của ${name}. Tiếp tục đánh bại mọi thử thách và trở thành nhà vô địch!`,
      `${name} là người chiến thắng! Hãy tiếp tục giữ vững vị trí này và chinh phục mọi đối thủ để trở thành nhà vô địch đích thực!`,
      `Tuyệt vời! ${name} đang dẫn đầu trò chơi. Đừng ngừng nỗ lực và giữ vững vị trí này để trở thành kẻ chiến thắng cuối cùng!`,
      `Chúc mừng ${name} đã chiến thắng! Hãy tiếp tục chinh phục mọi thử thách và trở thành người chơi giỏi nhất trong trò chơi này!`,
      `${name} đang có một khởi đầu tuyệt vời! Hãy tiếp tục vươn lên và trở thành người chơi đáng gờm nhất trong trò chơi này!`,
      `Chúc mừng ${name} đã đạt được vị trí top một! Hãy tiếp tục thể hiện tài năng của mình và giữ vững vị trí này để trở thành người chơi số 1 trong lòng các game thủ khác!`,
      `${name} là người chơi giỏi nhất! Hãy tiếp tục phát huy sức mạnh của mình và chiến thắng mọi đối thủ để trở thành kẻ vô địch trong trò chơi này!`,
    ]
  } else {
    introArr = [
      `${name} ơi, ${name} là người trả lời nhanh nhất trong lần chơi, gắng lên, sắp đuổi kịp người dẫn đầu rồi`,
      `${name} đang rất gần với vị trí top một rồi đấy! Hãy tiếp tục nỗ lực và bước tiếp đến chiến thắng!`,
      `${name} đang đuổi kịp người đứng đầu rất nhanh! Hãy tiếp tục giữ vững tinh thần này và chiến thắng sẽ đến với ${name}!`,
      `${name} là một người chơi tuyệt vời! Vị trí top một sẽ sớm thuộc về ${name} nếu ${name} không ngừng cố gắng!`,
      `${name} đang có một sự tiến bộ tuyệt vời! Hãy tiếp tục giữ vững phong độ này và ${name} sẽ chiến thắng trong cuộc đua top một!`,
      `${name} đang đuổi kịp người đứng đầu rất gần rồi! Hãy tiếp tục nỗ lực để bứt phá và đạt được vị trí cao nhất trong trò chơi này!`,
      `Chúc mừng ${name} đang dần tiến gần đến vị trí top một! Đừng dừng lại, hãy tiếp tục chiến đấu để đạt được mục tiêu cuối cùng!`,
      `${name} đang đánh bại các đối thủ một cách ngoạn mục! Hãy tiếp tục giữ vững sự tiến bộ này và chiến thắng sẽ đến với ${name}!`,
      `${name} đang có một sự cố gắng đáng kinh ngạc! Hãy tiếp tục giữ vững phong độ này và ${name} sẽ vượt qua người đứng đầu trong thời gian tới!`,
      `${name} đang đua trước các đối thủ khác một cách vượt trội! Hãy tiếp tục giữ vững phong độ và trở thành người chiến thắng trong cuộc đua top một!`,
      `${name} đang cho thấy một sự tiến bộ rõ rệt! Hãy tiếp tục đánh bại mọi đối thủ và đạt được vị trí top một trong trò chơi này!`,
    ];
  }
  return FunctionUtil.randomArr(introArr);
}

function introGame() {
  let index = 0;
  const introArr = [
    'Các bạn thả tim thật nhiều để lên điểm nha, năm lần tim sẽ nhận được một điểm, sẽ nhanh lên được top đầu thôi',
    'xe lai chim này được năm điểm, pho lâu hai mươi điểm, mỗi còm men là được một điểm',
    'Người đạt top một đến khi thời gian kết thúc sẽ giành được số tiền trên, ba tiếng sẽ sang lần chơi mới các bạn nhé',
    'Càng nhiều mắt xem tiền sẽ càng cao, các bạn hãy thả tim để kéo nhiều mắt xem nha',
  ];

  runSpeaking(introArr[index], (cb) => {
    index++;
    if (index < introArr.length) {
      runSpeaking(introArr[index], cb);
    } else {
      console.log('KẾT THÚC ĐỌC introGame');
      initSpeak('intro')
    }
  });
}

function runSpeaking(msg, cb) {
  isSpeaking = true;
  fetch('https://ntt123-viettts.hf.space/api/predict/',
    {
      method: "POST", body: JSON.stringify(
        { "data": [msg] }
      ),
      headers: { "Content-Type": "application/json" }
    }).then(function (response) {
      return response.json();
    }).then(function (json_response) {
      if (_.get(json_response, 'data[0]', '')) {
        if (_.get(json_response, 'data[0].is_file', false)) {
          let audio = speakAudio(_.get(json_response, 'data[0].name', ''));
          audio.addEventListener('ended', function () {
            cb(cb);
            isSpeaking = false;
          });
        }
      } else {
        isSpeaking = false;
      }
    })
}

function saveSpeaking(key, dataLive) {
  let text = congratulationGame(dataLive?.name, isTop());
  // fetch('https://ntt123-viettts.hf.space/api/predict/',
  //   {
  //     method: "POST", body: JSON.stringify(
  //       { "data": [text] }
  //     ),
  //     headers: { "Content-Type": "application/json" }
  //   }).then(function (response) {
  //     return response.json();
  //   }).then(function (json_response) {
  //     console.log({json_response})
  //     if (_.get(json_response, 'data[0].is_file', false)) {
  //       sessionStorage.setItem(key, _.get(json_response, 'data[0].name', ''));
  //     } else {
  //       const binaryData = atob(json_response.data[0].split(',')[1]);
  //       const dataUri = "data:audio/mpeg;base64," + btoa(binaryData);
  //       sessionStorage.setItem(key, dataUri);
  //     }
  //   })
}

function runSpeakChungMung(key) {
  sessionStorage.getItem(key);
  if (sessionStorage.getItem(key)) {
    speakAudio(sessionStorage.getItem(key))
  }
}

function speakAudio(audioSpeak) {
  let audioRun = new Audio(`https://ntt123-viettts.hf.space/file=${audioSpeak}`);
  audioRun.volume = 0.5;
  audioRun.play();
  return audioRun;
}
