var Furry = require("./furry.js");
var Coin = require("./coin.js");

function Game(){
    this.board = document.querySelectorAll("#board div");
    this.furry = new Furry();
    this.coin = new Coin();
    this.score = 0;
    this.index = function (x, y){
        return x + (y * 10);
    };
    this.showFurry = function(){
        this.board[this.index(this.furry.x, this.furry.y)].classList.add("furry");
    };
    this.showCoin = function (){
        this.board[this.index(this.coin.x, this.coin.y)].classList.add("coin");

    };

    this.hideVisibleFurry = function (){
        var furry = document.querySelector('.furry');
        furry.classList.remove("furry");

    };

    this.moveFurry = function (){
        if(this.furry.direction === "right") {
            this.furry.x = this.furry.x + 1;
        } else if (this.furry.direction === "left"){
            this.furry.x = this.furry.x - 1;
        } else if (this.furry.direction === "up"){
            this.furry.y = this.furry.y - 1;
        } else if (this.furry.direction === "down"){
            this.furry.y = this.furry.y + 1;
        }


        if (this.furry.x < 0 || this.furry.x > 9 || this.furry.y < 0 || this.furry.y > 9){
            this.gameOver();

        }
        else {
            this.hideVisibleFurry();
            this.showFurry();
            this.checkCoinCollision();

        }

    };
    this.turnFurry = function(event) {
        switch (event.which) {
            case 37:
                this.furry.direction = 'left';
                break;
            case 38:
                this.furry.direction = 'up';
                break;
            case 39:
                this.furry.direction = 'right';
                break;
            case 40:
                this.furry.direction = "down";
                break;
        }
    };

    this.checkCoinCollision = function(){
        if (this.furry.x === this.coin.x && this.furry.y === this.coin.y){
            this.board[this.index(this.coin.x, this.coin.y)].classList.remove("coin");
            this.score += 1;
            this.value = this.score;
            var idScore = document.querySelector("#score .score strong");
            idScore.innerText = this.value;
            this.coin = new Coin();
            this.showCoin();
        }
    };
    this.gameOver = function(){
        clearInterval(this.idSetinterval);
        clearInterval(this.timeInterval);
        var boardId = document.querySelector("#board");
        boardId.classList.add("invisible");
        var preSection = document.querySelector("#over");
        preSection.classList.remove("invisible");
        var scoreId = document.querySelector("#score");
        scoreId.classList.add("invisible");
        var yourScore = document.querySelector("#over .yourScore");
        if (this.value > 0){
            yourScore.innerText = this.value;
        }
        addScore(this.value);
    };


    var self = this;

    this.startGame = function(){
        this.idSetinterval = setInterval(this.startGame, 250);
        self.moveFurry();

    };

    this.stopGame = function(timeInSeconds){
        this.timeInterval = setInterval(function(){
            var time = document.querySelector(".time");
            var seconds = Math.floor( (timeInSeconds) % 60 );
            var minutes = Math.floor( (timeInSeconds/60) % 60 );
            time.innerText = minutes + ':' + seconds;
            timeInSeconds--;
            if(timeInSeconds < 0){
                clearInterval(this.timeInterval);
                self.gameOver();
            }

        },1000);

        if(timeInSeconds < 0){
            clearInterval(this.timeInterval);

        }
    }
}


function addScore(points) {
    if (points === undefined){
        points = 0;
    }

    if (typeof db === 'undefined') {
        console.error('Firebase is not initialized!');
        return;
    }

    db.collection('furry').add({
        result: points,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
        console.log("Score saved with ID:", docRef.id);
        getTheBestScore();
    })
    .catch(function(error) {
        console.error("Error saving score:", error);
    });
}

function insertResult(scores) {
    var arr = scores.map(function(item){
        return parseInt(item.result);
    });

    arr.sort(function(a, b){
        return b - a;
    });

    showMaxScore(arr[0] || 0);
}

function showMaxScore(maxResult) {
    var maxScore = document.querySelector("#over .maxScore");
    if (maxScore) {
        maxScore.innerText = maxResult;
    }
}

function getTheBestScore(){
    if (typeof db === 'undefined') {
        console.error('Firebase is not initialized!');
        return;
    }

    db.collection('furry')
        .orderBy('result', 'desc')
        .limit(100)
        .get()
        .then(function(querySnapshot) {
            var scores = [];
            querySnapshot.forEach(function(doc) {
                scores.push({
                    id: doc.id,
                    result: doc.data().result
                });
            });

            if (scores.length > 0) {
                console.log("Loaded", scores.length, "scores from Firestore");
                insertResult(scores);
            } else {
                console.log("No scores found in Firestore");
                showMaxScore(0);
            }
        })
        .catch(function(error) {
            console.error("Error loading scores:", error);
            showMaxScore(0);
        });
}
getTheBestScore();




module.exports = Game;