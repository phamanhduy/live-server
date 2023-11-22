
const score = {
    rose: 'A',
    candy: 'B',
};
const ailatrieuphu = () => {
    let index = 0;
    let games = {
        type: 'altp',
        run: [
            { 
                "question":"Câu 1:Đây là ai ?:",
                 "choices": [
                    {"stt": 'A', "text": "Donald Trump"},
                    {"stt": 'B', "text": "Donald Trump"},
                    {"stt": 'C', "text": "Donald Trump"},
                    {"stt": 'D', "text": "Donald Trump"}
                ],
                 "image" : 'https://f9-zpcloud.zdn.vn/8578884093705916512/8e6222d954078959d016.jpg',
                 "answer" : 'A',
                 "score" : 100
              },
              { 
                "question":"Câu 1:Đây là ai ?:",
                 "choices": [
                    {"stt": 'A', "text": "Donald Trump"},
                    {"stt": 'B', "text": "Donald Trump"},
                    {"stt": 'C', "text": "Donald Trump"},
                    {"stt": 'D', "text": "Donald Trump"}
                ],
                 "image" : 'https://f9-zpcloud.zdn.vn/8578884093705916512/8e6222d954078959d016.jpg',
                 "answer" : 'A',
                 "score" : 100
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
    console.log({index})
    return games.run[index];
}
1