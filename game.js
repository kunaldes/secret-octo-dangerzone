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
        
    var moveHandler = function(evt, thisGame) {
        var x = evt.pageX - canvas.offsetLeft;
        var y = evt.pageY - canvas.offsetTop;
        
        //set player y
        thisGame.player.y = y - player.height / 2;
    }
    
    var initGame = function() {
        state = "game";
        
        console.log("initing game");
        
        this.camera = new Camera(ctx);
        camera.setGameViewSize(canvas.width, canvas.height);
        camera.setScreenSize(canvas.width, canvas.height);
        
        this.gameObjects = [];
        
        this.player = new Player();
        player.x = 0;
        player.y = canvas.height / 2 - player.height / 2;
        this.player.xSpeed = 4;
        
        var barriers = Barrier.generateBarriers();
        
        this.gameObjects.push(player);
        this.gameObjects = this.gameObjects.concat(barriers);
        
        var thisGame = this;
        canvas.addEventListener("mousemove", function(evt) { moveHandler(evt, thisGame); });
    }
    
    var onPlayerCollision = function() {
        player.x = 0; //jump to beginning, do more later
    }
    
    var gameLoop = function() {
        loopCount++;
        ctx.clearRect(0, 0, 800, 600);
        
        if (state === "menu") {
            menu.draw();
        }
        else if (state === "game") {
        
            //update
            for(var i = 0; i < this.gameObjects.length; i++) {
                var obj = this.gameObjects[i];                
                if(typeof(obj.update) === "function")
                    obj.update();
            }
            
            //check collisions
            for(i = 0; i < this.gameObjects.length; i++) {
                var obj = this.gameObjects[i];
                if(obj === this.player) continue;
                if(utils.doesIntersect(this.player, obj))
                    onPlayerCollision();
            }
            
            this.camera.centerViewOn(player);
            
            //draw
            for(i = 0; i < this.gameObjects.length; i++) {
                var obj = this.gameObjects[i];  
                if(typeof(obj.draw) === "function")
                    obj.draw(this.camera);
            }
        }
    }
    
    this.start = function() {
        console.log("game started");
        setInterval(gameLoop, 1000 / FPS);
        
        menu.startMenu();
    }
}

var game = new Game();
game.start();
