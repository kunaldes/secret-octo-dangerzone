var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function Menu(startGameCallback) {
    var startColor = "green";
    var helpColor = "green";
    
    var bX = 200;
    var bY = 100;
    var bWidth = 400;
    var bHeight = 150;
    var bPadding = 50;
    
    this.draw = function() {
        ctx.fillStyle = startColor;
        ctx.fillRect(bX, bY, bWidth, bHeight);
        
        ctx.fillStyle = helpColor;
        ctx.fillRect(bX, bY + bHeight + bPadding, bWidth, bHeight);
    }
    
    var moveHandler = function(evt) {
        var x = evt.pageX - canvas.offsetLeft;
        var y = evt.pageY - canvas.offsetTop;
        
        if (x > bX && x < bX + bWidth && y > bY && y < bY + bHeight) {
            startColor = "red";
        } else {
            startColor = "green";
        }
        
        if (x > bX && x < bX + bWidth && y > bY + bHeight + bPadding && y < bY + 2*bHeight + bPadding) {
            helpColor = "red";
        } else {
            helpColor = "green";
        }
    }
    
    var clickHandler = function(evt) {
        var x = evt.pageX - canvas.offsetLeft;
        var y = evt.pageY - canvas.offsetTop;
        
        if (x > bX && x < bX + bWidth && y > bY && y < bY + bHeight) {
            startGameCallback();
        }
    }
    
    canvas.addEventListener("mousemove", moveHandler);
    canvas.addEventListener("mousedown", clickHandler);
}


function Game() {
    var FPS = 60;
    var i = 0;
    var inMenu = true;
    
    var menu = new Menu(function() {
        inMenu = false;
    });
    
    function gameLoop() {
        i = (i + 1) % FPS;
        
        if (inMenu){
            menu.draw();
        } else {
            ctx.clearRect(0, 0, 800, 600);
            ctx.fillStyle = "orange";
            ctx.fillRect(300 + i * 2,200, 100, 100);
        }
    }
    
    this.start = function() {
        console.log("game started");
        setInterval(gameLoop, 1000/FPS);
    }
}

var game = new Game();
game.start();
