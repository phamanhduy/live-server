
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
            },
            {
                "question": "Sếch-xpia thường viết thể loại kịch nào?",
                "choices": [
                    { "stt": "A", "text": "Bi kịch, hài kịch, kịch câm" },
                    { "stt": "B", "text": "Hài kịch, kịch lịch sử, kịch câm" },
                    { "stt": "C", "text": "Bi kịch, kịch câm, kịch lịch sử" },
                    { "stt": "D", "text": "Hài kịch, bi kịch, kịch lịch sử" }
                ],
                "image": "",
                "answer": "D",
                "score": 100
            },
            {
                "question": "Tình yêu và thù hận thuộc thể loại kịch nào?",
                "choices": [
                    { "stt": "A", "text": "Kịch câm" },
                    { "stt": "B", "text": "Bi kịch" },
                    { "stt": "C", "text": "Kịch lịch sử" },
                    { "stt": "D", "text": "Hài kịch" }
                ],
                "image": "",
                "answer": "B",
                "score": 100
            },
            {
                "question": "William Shakespcare (Sếch-xpia) là nhà soạn kịch nổi tiếng của nước nào?",
                "choices": [
                    { "stt": "A", "text": "Đức" },
                    { "stt": "B", "text": "Anh" },
                    { "stt": "C", "text": "Nga" },
                    { "stt": "D", "text": "Pháp" }
                ],
                "image": "",
                "answer": "B",
                "score": 100
            },
            {
                "question": "Câu nào sau đây nhận định không đúng về ý nghĩa cái chết của đôi tình nhân Rô-mê-ô và Giu-li-ét?",
                "choices": [
                    { "stt": "A", "text": "Cái chết của đôi tình nhân có sức mạnh hoá giải thù hận." },
                    { "stt": "B", "text": "Sự bất lực của tình yêu chân chính." },
                    { "stt": "C", "text": "Ca ngợi vẻ đẹp của hạnh phúc trần thế." },
                    { "stt": "D", "text": "Tác giả chứng minh sức mạnh tình yêu chân chính đã chiến thắng thù hận." }
                ],
                "image": "",
                "answer": "C",
                "score": 100
            },
            {
                "question": "Vở kịch 'Tình yêu và thù hận' được trích từ tác phẩm nào?",
                "choices": [
                    { "stt": "A", "text": "Đam mê" },
                    { "stt": "B", "text": "Rô-mê-ô và Giu-li-ét" },
                    { "stt": "C", "text": "Hận tình" },
                    { "stt": "D", "text": "Mối tình đầu" }
                ],
                "image": "",
                "answer": "B",
                "score": 100
            },
            {
                "question": "Lời thoại trong kịch bao gồm:",
                "choices": [
                    { "stt": "A", "text": "Hội thoại" },
                    { "stt": "B", "text": "Độc thoại" },
                    { "stt": "C", "text": "Cả hai phương án trên" }
                ],
                "image": "",
                "answer": "C",
                "score": 100
            },
            {
                "question": "Vở kịch nào sau đây của Sếch-xpia không phải là bi kịch?",
                "choices": [
                    { "stt": "A", "text": "Rô-mê-ô và Giu-li-et." },
                    { "stt": "B", "text": "Giấc mộng đêm hè." },
                    { "stt": "C", "text": "Hăm-lét." },
                    { "stt": "D", "text": "Vua Lia." }
                ],
                "image": "",
                "answer": "B",
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Trần Đại Quang" },
                    { "stt": 'B', "text": "Nguyễn Phú Trọng" },
                    { "stt": 'C', "text": "Nguyễn Xuân Phúc" },
                    { "stt": 'D', "text": "Phạm Minh Chính" }
                ],
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYDAtS4f-DN1e3vAwW3f3GvslLG6YYYY6RxlB9if9GTlsfKoU4FVzgtCQNl426",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Hoàng Thùy Linh" },
                    { "stt": 'B', "text": "Ngọc Trinh" },
                    { "stt": 'C', "text": "Mai Phương Thúy" },
                    { "stt": 'D', "text": "Lan Khuê" }
                ],
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKQuIkgZl_4yPsWT5gzVb-i8rwVll-aNNBB0COIeax9AxKSpZjjda6RI5z9Rm-",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Trường Giang" },
                    { "stt": 'B', "text": "Trấn Thành" },
                    { "stt": 'C', "text": "Hoài Linh" },
                    { "stt": 'D', "text": "Đức Huy" }
                ],
                "image": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSXTwxCNoaZl3o7Wfw03lFXu79jEo2uwNW5OWS8b62WHdXcTSds0-OEc6EBvr2X",
                "answer": 'A',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Đặng Văn Lâm" },
                    { "stt": 'B', "text": "Nguyễn Văn Hùng" },
                    { "stt": 'C', "text": "Nguyễn Công Phượng" },
                    { "stt": 'D', "text": "Lương Xuân Trường" }
                ],
                "image": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRb9PKD2cBaadyVK_U8hzMzwfC-yNi3F3RAjzH2RfYnDZesUzz6lmgK0Z7dHQJP",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Nguyễn Quốc Khánh" },
                    { "stt": 'B', "text": "Đinh La Thăng" },
                    { "stt": 'C', "text": "Nguyễn Văn Thành" },
                    { "stt": 'D', "text": "Trương Quang Nghĩa" }
                ],
                "image": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQTjdhqd9nRwRKevtt78tQBHUPylczhQo7chrc16C04XL8MMr-jjael6txBikg-",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Lê Thị Diễm Trang" },
                    { "stt": 'B', "text": "Lý Nhã Kỳ" },
                    { "stt": 'C', "text": "Hồ Ngọc Hà" },
                    { "stt": 'D', "text": "Đàm Vĩnh Hưng" }
                ],
                "image": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSefuA5uiOH5HvLibJk2I5tWmwy11WUmanx5TtOiA9ElwchpWCvUgGw1Z6xLQIU",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Nguyễn Tấn Dũng" },
                    { "stt": 'B', "text": "Võ Văn Kiệt" },
                    { "stt": 'C', "text": "Phan Văn Khải" },
                    { "stt": 'D', "text": "Nguyễn Minh Triết" }
                ],
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCXEz6gt7UiEGjcnQKipVfJbvkynGZtJUPvjXo3Zdm4aERRHnz3t3rDx33PU-N",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Phan Bội Châu" },
                    { "stt": 'B', "text": "Lý Quang Diệu" },
                    { "stt": 'C', "text": "Ngô Bảo Châu" },
                    { "stt": 'D', "text": "Trịnh Xuân Thanh" }
                ],
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWfo4rUAZCDps52OEMm-9_VoZnciPjAPrzBm9f-R3Iksd98JxG1ZDjIB_Ndf8A",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Trương Hòa Bình" },
                    { "stt": 'B', "text": "Trần Lệ Xuân" },
                    { "stt": 'C', "text": "Phan Văn Trường" },
                    { "stt": 'D', "text": "Phan Bội Châu" }
                ],
                "image": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQPr3ZFK6v4W1EmQRoIurh7F9bre56n1Zdn1JKm-yhFckUoMBTXYgFsQHf17K7m",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Lê Quang Liêm" },
                    { "stt": 'B', "text": "Nguyễn Hữu Thọ" },
                    { "stt": 'C', "text": "Trần Đăng Khoa" },
                    { "stt": 'D', "text": "Nguyễn Bá Thanh" }
                ],
                "image": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRekFGbJI9coaQo0BVPpMnXqL3C799aBHw0g3oOwtc7AhEj9SiStTkwDTd8Fyws",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Nguyễn Thị Nga" },
                    { "stt": 'B', "text": "Đặng Thị Ngọc Thịnh" },
                    { "stt": 'C', "text": "Phạm Minh Chính" },
                    { "stt": 'D', "text": "Võ Văn Kiệt" }
                ],
                "image": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTOVtbamf0zXIWABY2FdjAj-w2pzxU1s-zC_EC9q_xs2zdIW8kxKleoCVzxNsG3",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Sự rung cảm và quyến luyến sâu sắc giữa hai người khác giới được gọi là",
                "choices": [
                    { "stt": 'A', "text": "tình bạn." },
                    { "stt": 'B', "text": "tình yêu." },
                    { "stt": 'C', "text": "tình thương." },
                    { "stt": 'D', "text": "tình đồng chí." }
                ],
                "image": "",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Tình yêu là sự tự nguyện sống vì nhau và sẵn sàng hiến dâng cho nhau",
                "choices": [
                    { "stt": 'A', "text": "cuộc đời của mình." },
                    { "stt": 'B', "text": "hạnh phúc của mình." },
                    { "stt": 'C', "text": "gia đình của mình." },
                    { "stt": 'D', "text": "cuộc sống của mình." }
                ],
                "image": "",
                "answer": 'D',
                "score": 100
            },
            {
                "question": "Tình yêu là một dạng tình cảm",
                "choices": [
                    { "stt": 'A', "text": "tuyệt đối của con người." },
                    { "stt": 'B', "text": "đặc biệt của con người." },
                    { "stt": 'C', "text": "thiêng liêng nhất của con người." },
                    { "stt": 'D', "text": "cao quý nhất của con người." }
                ],
                "image": "",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Hôn nhân là quan hệ giữa vợ với chồng sau khi",
                "choices": [
                    { "stt": 'A', "text": "ly hôn." },
                    { "stt": 'B', "text": "tảo hôn." },
                    { "stt": 'C', "text": "kết hôn." },
                    { "stt": 'D', "text": "ly thân." }
                ],
                "image": "",
                "answer": 'C',
                "score": 100
            },
            {
                "question": "Hôn nhân được đánh dấu bằng sự kiện nào dưới đây?",
                "choices": [
                    { "stt": 'A', "text": "Kết hôn." },
                    { "stt": 'B', "text": "Cưới xin." },
                    { "stt": 'C', "text": "Tình yêu." },
                    { "stt": 'D', "text": "Ra mắt họ hàng." }
                ],
                "image": "",
                "answer": 'A',
                "score": 100
            },
            {
                "question": "Hôn nhân tự nguyện và tiến bộ dựa trên",
                "choices": [
                    { "stt": 'A', "text": "tình bạn." },
                    { "stt": 'B', "text": "tình đồng chí." },
                    { "stt": 'C', "text": "tình yêu thương." },
                    { "stt": 'D', "text": "tình yêu chân chính." }
                ],
                "image": "",
                "answer": 'D',
                "score": 100
            },
            {
                "question": "Gia đình được hình thành trên các mối quan hệ cơ bản nào dưới đây?",
                "choices": [
                    { "stt": 'A', "text": "Hôn nhân và huyết thống." },
                    { "stt": 'B', "text": "Nhân thân và tài sản." },
                    { "stt": 'C', "text": "Họ hàng nội, ngoại." },
                    { "stt": 'D', "text": "Anh em xa, gần." }
                ],
                "image": "",
                "answer": 'A',
                "score": 100
            },
            {
                "question": "Nội dung nào dưới đây không phải là chức năng của gia đình?",
                "choices": [
                    { "stt": 'A', "text": "Duy trì nòi giống." },
                    { "stt": 'B', "text": "Nuôi dưỡng, giáo dục con cái." },
                    { "stt": 'C', "text": "Phát triển kinh tế xã hội." },
                    { "stt": 'D', "text": "Tổ chức đời sống gia đình." }
                ],
                "image": "",
                "answer": 'C',
                "score": 100
            },
            {
                "question": "Các gia đình phải biết tổ chức sản xuất kinh doanh, dịch vụ phù hợp với khả năng và điều kiện của mình là nội dung chức năng nào dưới đây?",
                "choices": [
                    { "stt": 'A', "text": "Kinh tế." },
                    { "stt": 'B', "text": "Sản xuất." },
                    { "stt": 'C', "text": "Tổ chức đời sống." },
                    { "stt": 'D', "text": "Duy trì nòi giống." }
                ],
                "image": "",
                "answer": 'A',
                "score": 100
            },
            {
                "question": "Nội dung nào dưới đây không phải là biểu hiện của tình yêu chân chính?",
                "choices": [
                    { "stt": 'A', "text": "Tình cảm chân thực, gắn bó." },
                    { "stt": 'B', "text": "Quan tâm sâu sắc đến nhau." },
                    { "stt": 'C', "text": "Có lòng vị tha và thông cảm." },
                    { "stt": 'D', "text": "Có sự bảo đảm về vật chất." }
                ],
                "image": "",
                "answer": 'D',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "LeBron James" },
                    { "stt": 'B', "text": "Kobe Bryant" },
                    { "stt": 'C', "text": "Michael Jordan" },
                    { "stt": 'D', "text": "Stephen Curry" }
                ],
                "image": "https://pbs.twimg.com/media/F4b2dj7WUAA9ed8.jpg",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Kylie Jenner" },
                    { "stt": 'B', "text": "Kim Kardashian" },
                    { "stt": 'C', "text": "Kendall Jenner" },
                    { "stt": 'D', "text": "Khloé Kardashian" }
                ],
                "image": "https://phantom-marca.unidadeditorial.es/35a964a3dc7be2db2f8125769f331a6d/crop/21x0/2046x1350/resize/660/f/webp/assets/multimedia/imagenes/2023/11/21/17005906158420.png",
                "answer": 'C',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Mark Zuckerberg" },
                    { "stt": 'B', "text": "Jack Dorsey" },
                    { "stt": 'C', "text": "Sundar Pichai" },
                    { "stt": 'D', "text": "Tim Cook" }
                ],
                "image": "https://s.yimg.com/ny/api/res/1.2/Rk.clct_.azp0Xh1ZD2hdA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNw--/https://media.zenfs.com/en/fortune_175/1d975cabcc368051f75c31ae2e65c7e2",
                "answer": 'D',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Dwayne Johnson" },
                    { "stt": 'B', "text": "Chris Hemsworth" },
                    { "stt": 'C', "text": "Ryan Reynolds" },
                    { "stt": 'D', "text": "Tom Hardy" }
                ],
                "image": "https://www.goldderby.com/wp-content/uploads/2019/10/Ryan-Reynolds.jpg?w=640",
                "answer": 'C',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Serena Williams" },
                    { "stt": 'B', "text": "Maria Sharapova" },
                    { "stt": 'C', "text": "Simona Halep" },
                    { "stt": 'D', "text": "Naomi Osaka" }
                ],
                "image": "https://www.naomiosaka.com/wp-content/uploads/2021/06/NO_LV_OPT.jpg",
                "answer": 'D',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "LeBron James" },
                    { "stt": 'B', "text": "Kobe Bryant" },
                    { "stt": 'C', "text": "Michael Jordan" },
                    { "stt": 'D', "text": "Stephen Curry" }
                ],
                "image": "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png",
                "answer": 'D',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Kylie Jenner" },
                    { "stt": 'B', "text": "Kim Kardashian" },
                    { "stt": 'C', "text": "Kendall Jenner" },
                    { "stt": 'D', "text": "Khloé Kardashian" }
                ],
                "image": "https://e3.365dm.com/23/06/1600x900/skynews-kylie-jenner-met-gala_6200523.jpg?20230627140535",
                "answer": 'A',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Mark Zuckerberg" },
                    { "stt": 'B', "text": "Jack Dorsey" },
                    { "stt": 'C', "text": "Sundar Pichai" },
                    { "stt": 'D', "text": "Tim Cook" }
                ],
                "image": "https://bsmedia.business-standard.com/_media/bs/img/article/2018-12/12/full/1544633338-8104.jpg?im=FeatureCrop,size=(826,465)",
                "answer": 'C',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Dwayne Johnson" },
                    { "stt": 'B', "text": "Chris Hemsworth" },
                    { "stt": 'C', "text": "Ryan Reynolds" },
                    { "stt": 'D', "text": "Tom Hardy" }
                ],
                "image": "https://www.mensjournal.com/.image/t_share/MTk2MTM3MjIxNjU2NjE4MTI5/shot_02_0024-497a09f7-a16f-4c9e-af1b-f7f91dccd2b4.jpg",
                "answer": 'B',
                "score": 100
            },
            {
                "question": "Đây là ai?",
                "choices": [
                    { "stt": 'A', "text": "Serena Williams" },
                    { "stt": 'B', "text": "Maria Sharapova" },
                    { "stt": 'C', "text": "Simona Halep" },
                    { "stt": 'D', "text": "Naomi Osaka" }
                ],
                "image": "https://ca-times.brightspotcdn.com/dims4/default/af2504e/2147483647/strip/true/crop/2571x1519+683+125/resize/1200x709!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F69%2F7b%2Fd24e8e9a4c679d77ecfdbcb6d4b9%2Fus-open-tennis-36425.jpg",
                "answer": 'A',
                "score": 100
            },
            // Tiếp tục thêm câu hỏi...

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