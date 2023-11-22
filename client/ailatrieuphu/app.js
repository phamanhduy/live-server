function Game(questions) {
    this.questions = questions;
}
Game.prototype.startGame = function(e) {
        GameUI.startRunTimer()
};

var GameUI = {
    startRunTimer: (duration = 20) => {
        var display = document.getElementById('clock');
        let totalSeconds = duration;
        setInterval(function() {
          let minutes = parseInt(Math.floor(totalSeconds / 60), 10);
          let seconds = parseInt(totalSeconds % 60, 10);
          minutes = minutes < 10 ? '0' + minutes : minutes;
          seconds = seconds < 10 ? '0' + seconds : seconds;
          if (totalSeconds >= 0) {
            display.textContent = seconds;
          }
          // Replace with your own code to update the countdown display
          if (totalSeconds === duration) {
            GameUI.displayNext();
          }
          if (totalSeconds === 5) {
            // 
          }
          if (totalSeconds === 0) {
            GameUI.displayNext();
            totalSeconds = duration;
          }
          totalSeconds--;
        }, 1000);
      
    },
    displayNext: function() {
        const game = ailatrieuphu();
        sessionStorage.setItem('play', JSON.stringify(game));
        this.displayQuestion(game);
        this.displayMedia(game);
        this.displayChoices(game);
    },
    displayQuestion: function(question) {
        var question = $("#question").text(_.get(question, 'question'));
    },
    displayMedia: function(question) {
        console.log({question})
        if (_.get(question, 'image')) {
            var image = question.image;
            var img = '<img src=' + image + '>';
            $('.box-media').show();
            $('.answer').css('margin-top', '0');
            $('.box-media').html(img);
        } else {
            $('.box-media').hide();
            $('.answer').css('margin-top', '100px');
        }
    },
    showGift: () => {

    },
    displayChoices: function(question) {
        var choices = _.get(question, 'choices') || [];
        var html = '';
        for (var i = 0; i < choices.length; i++) {
            let image = '<img width="17px" src="https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.png" />'
            if (i == 1) {
                image = '<img width="17px" src="https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/d56945782445b0b8c8658ed44f894c7b~tplv-obj.png" />'
            } else if (i == 2) {
                image = '<img width="17px" src="https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/802a21ae29f9fae5abe3693de9f874bd~tplv-obj.png" />'
            } else if (i == 3) {
                image = '<img width="17px" src="https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/a4c4dc437fd3a6632aba149769491f49.png~tplv-obj.png" />'
            }
            let choice = choices[i];
            html += `<div class="col-6 col-sm-3"><button type="button" class="raise" id="choice-${i}">${image} ${_.get(choice, 'stt')}. ${_.get(choice, 'text')}</button></div>`;
        }
        $(".answer .row").html(html);
    },
    displayHTML: function(elmShow, elmHide) {
        $(elmHide).hide();
        $(elmShow).show();
    },

}

var GameAudio = {
    playAudio: function(key, val) {
        var audio = document.querySelector(`audio[data-${key}="${val}"]`);
        audio.play();
    }
}


// Create Game
var questions = data.questions;
var game = new Game(questions);
GameAudio.playAudio('key', 1);
game.startGame();
