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
            canvas.removeEventListener("mousemove", moveHandler);
            canvas.removeEventListener("mousedown", clickHandler);
            startGameCallback();
        }
    }
    
    this.startMenu = function() {
        canvas.addEventListener("mousemove", moveHandler);
        canvas.addEventListener("mousedown", clickHandler);
    }
}


function Game() {
    var FPS = 60;
    var state = "menu";
    var loopCount = 0;
    
    var menu = new Menu(function() {
        initGame();
    });
    
    menu.startMenu();
    
    function gameLoop() {
        loopCount++;
        ctx.clearRect(0, 0, 800, 600);
        
        if (state === "menu"){
            menu.draw();
        }
        else if (state === "game") {
            for(var i = 0; i < this.gameObjects.length; i++) {
                var obj = this.gameObjects[i];                
                if(typeof(obj.update) === "function")
                    obj.update();
                if(typeof(obj.draw) === "function")
                    obj.draw(this.camera);
            }
            
            if((loopCount % 100) === 0) {
                this.player.acceleration = ((Math.floor(loopCount / 100) % 2) * 2 - 1) * .2;
            }
        }
    }
    
    function initGame() {
        state = "game";
        
        this.camera = new Camera(ctx);
        camera.setGameViewSize(400, 300);
        
        this.player = new Player();
        player.x = 100;
        player.y = 150 - player.height / 2;
        
        this.gameObjects = [player];
    }
    
    this.start = function() {
        console.log("game started");
        setInterval(gameLoop, 1000/FPS);
    }
}

var game = new Game();
game.start();
