
const score = {
    'Rose': 'A',
    'Heart Me': 'B',
    'TikTok': 'C',
    'Finger Heart': 'D',
};

const ailatrieuphu = () => {
    let index = 0;
    let games = {
        type: 'altp',
        run: [
                {
                    "question": "Vệ tinh viễn thông đầu tiên của Việt Nam vừa phóng thành công vào vũ trụ tháng 5/2008 vừa qua có tên là:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "VINASHIP",
                        },
                        {
                            "stt": "B",
                            "text": "VINASAT",
                        },
                        {
                            "stt": "C",
                            "text": "VINASAT-1",
                        },
                        {
                            "stt": "C",
                            "text": "VINASAT-2",
                        },
                    ],
                    "image": '',
                    "answer": "C",
                    "score": 100,
                },
                {
                    "question": "Thế vận hội thế giới được tổ chức tại Bắc Kinh khai mạc vào ngày:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "07/07/2007",
                        },
                        {
                            "stt": "B",
                            "text": "08/08/2008",
                        },
                        {
                            "stt": "C",
                            "text": "08/08/2007",
                        },
                        {
                            "stt": "C",
                            "text": "07/07/2008",
                        },
                    ],
                    "image": '',
                    "answer": "B",
                    "score": 100,
                },
                {
                    "question": "Tại Olympic Bắc Kinh 2008, Việt Nam có một vận động viên giành huy chương cao nhất trong số những huy chương mà Việt Nam đạt được, đó là vận động viên:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "Đoàn Kiến Quốc",
                        },
                        {
                            "stt": "B",
                            "text": "Nguyễn Mạnh Tường",
                        },
                        {
                            "stt": "C",
                            "text": "Phan Thanh Bình",
                        },
                        {
                            "stt": "C",
                            "text": "Hoàng Anh Tuấn",
                        },
                    ],
                    "image": '',
                    "answer": "C",
                    "score": 100,
                },
                {
                    "question": "Tại Olympic Bắc Kinh 2008, vận động viên Hoàng Anh Tuấn của Việt Nam giành được một huy chương đặc biệt, làm vang danh lịch sử thể thao Việt Nam, đó là:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "Huy chương vàng",
                        },
                        {
                            "stt": "B",
                            "text": "Huy chương bạc",
                        },
                        {
                            "stt": "C",
                            "text": "Huy chương đồng",
                        },
                        {
                            "stt": "C",
                            "text": "Huy chương cho tinh thần “Fair play”",
                        },
                    ],
                    "image": '',
                    "answer": "C",
                    "score": 100,
                },
                {
                    "question": "Tại Olympic Bắc Kinh 2008, Việt Nam giành duy nhất một Huy chương bạc tại bộ môn:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "Thể hình",
                        },
                        {
                            "stt": "B",
                            "text": "Cử tạ",
                        },
                        {
                            "stt": "C",
                            "text": "Bida",
                        },
                        {
                            "stt": "C",
                            "text": "Bơi lội",
                        },
                    ],
                    "image": '',
                    "answer": "B",
                    "score": 100,
                },
                {
                    "question": "Hà Nội kỉ niệm 1000 năm Thăng Long vào thời gian nào:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "10/10/2008",
                        },
                        {
                            "stt": "B",
                            "text": "10/10/2009",
                        },
                        {
                            "stt": "C",
                            "text": "10/10/2010",
                        },
                        {
                            "stt": "C",
                            "text": "01/10/2010",
                        },
                    ],
                    "answer": "C",
                    "score": 100,
                },
                {
                    "question": "“Chiếu dời đô” của vua Lý Công Uẩn ra đời vào năm:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "1010",
                        },
                        {
                            "stt": "B",
                            "text": "1011",
                        },
                        {
                            "stt": "C",
                            "text": "1100",
                        },
                        {
                            "stt": "C",
                            "text": "1101",
                        },
                    ],
                    "answer": "A",
                    "score": 100,
                },
                {
                    "question": "Ngày 5 tháng 5 Âm lịch hằng năm là ngày Tết cổ truyền gì của dân tộc ta:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "Tết Trung thu",
                        },
                        {
                            "stt": "B",
                            "text": "Tết Thiếu nhi",
                        },
                        {
                            "stt": "C",
                            "text": "Tết Trùng cửu",
                        },
                        {
                            "stt": "C",
                            "text": "Tết Đoan ngọ",
                        },
                    ],
                    "answer": "C",
                    "score": 100,
                },
                {
                    "question": "Tác giả bài Quốc ca nước CHXHCN Việt Nam là:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "Nhạc sĩ Văn Cao",
                        },
                        {
                            "stt": "B",
                            "text": "Nhạc sĩ Văn Ký",
                        },
                        {
                            "stt": "C",
                            "text": "Nhạc sĩ Hoàng Hòa",
                        },
                        {
                            "stt": "C",
                            "text": "Nhạc sĩ Lưu Hữu Phước",
                        },
                    ],
                    "answer": "C",
                    "score": 100,
                },
                {
                    "question": "Hãng hàng không nào sau đây không phải là hãng hàng không giá rẻ:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "Jetstar Airline",
                        },
                        {
                            "stt": "B",
                            "text": "Pacific Airline",
                        },
                        {
                            "stt": "C",
                            "text": "Tiger Airway",
                        },
                        {
                            "stt": "C",
                            "text": "Vietnam Airline",
                        },
                    ],
                    "answer": "C",
                    "score": 100,
                },
                {
                    "question": "Di sản nào sau đây không phải là Di sản văn hoá Phi vật thể:",
                    "choices": [
                        {
                            "stt": "A",
                            "text": "Áo dài",
                        },
                        {
                            "stt": "B",
                            "text": "Cồng chiêng Tây Nguyên",
                        },
                        {
                            "stt": "C",
                            "text": "Nhã nhạc cung đình Huế",
                        },
                        {
                            "stt": "C",
                            "text": "Thánh địa Mỹ Sơn",
                        },
                    ],
                    "answer": "A",
                    "score": 10
                }
        ]
    };
    if (sessionStorage.getItem('gameSTT')) {
        index = parseInt(sessionStorage.getItem('gameSTT')) + 1;
    }
    sessionStorage.setItem('gameSTT', index);
    if (parseInt(sessionStorage.getItem('gameSTT')) === games.run.length) {
        sessionStorage.setItem('gameSTT', 0);
    }
    if (!games.run[index]) {
        sessionStorage.setItem('gameSTT', 0);
        index = 0;
    }
    return games.run[index];
}
1