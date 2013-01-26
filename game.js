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
    this.gameWidth = canvas.width;
    this.gameHeight = canvas.height;
    var thisGame = this;
    
    var menu = new Menu(function() {
        thisGame.initGame();
    });
        
    var moveHandler = function(evt, thisGame) {
        var x = evt.pageX - canvas.offsetLeft;
        var y = evt.pageY - canvas.offsetTop;
        
        //set player y
        thisGame.player.y = y - thisGame.player.height / 2;
    }
    
    this.initCameras = function() {
        var sideCameraWidth = 150;
        var playerCameraWidth = canvas.width - sideCameraWidth;
        
        this.playerCamera = new Camera(ctx);
        this.playerCamera.setGameViewSize(playerCameraWidth, canvas.height);
        this.playerCamera.setScreenSize(canvas.width - sideCameraWidth, canvas.height);
        this.playerCamera.setScreenPosition(sideCameraWidth, 0);
        
        this.sideCamera = new Camera(ctx);
        this.sideCamera.setGameViewSize(playerCameraWidth, canvas.height);
        this.sideCamera.setScreenSize(sideCameraWidth, canvas.height);
    }
    
    this.initGame = function() {
        state = "game";
        
        console.log("initing game");
        
        this.initCameras();
        
        this.player = new Player();
        this.player.x = 0;
        this.player.y = canvas.height / 2 - this.player.height / 2;
        this.player.xSpeed = 4;
        
        this.gameObjects = [];
        this.gameObjects.push(this.player);
        
        //this.obstacleManager = new ObstacleManager(this);
        
        var barriers = Barrier.generateBarriers();
        this.gameObjects = this.gameObjects.concat(barriers);
        
        
        var thisGame = this;
        canvas.addEventListener("mousemove", function(evt) { moveHandler(evt, thisGame); });
    }
    
    this.onPlayerCollision = function() {
        this.player.x = 0; //jump to beginning, do more later
    }
    
    this.addGameObj = function(obj) {
        this.gameObjects.push(obj);
    }
    
    this.removeGameObj = function(obj) {
        var index = this.gameObjects.indexOf(obj);
        this.gameObjects.splice(index, 1); //delete from array
    };
    
    this.isObjectOnScreen = function(obj) {
        return this.playerCamera.getObjectBoundsOnScreen(obj) !== null;
    }
    
    this.gameLoop = function() {
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
            
            //this.obstacleManager.update();
            
            //check collisions
            for(i = 0; i < this.gameObjects.length; i++) {
                var obj = this.gameObjects[i];
                if(obj === this.player) continue;
                if(utils.doesIntersect(this.player, obj))
                    this.onPlayerCollision();
            }
            
            this.playerCamera.centerViewOn(this.player);
            this.sideCamera.setGamePosition(this.playerCamera.gameX, this.sideCamera.gameY);
            
            //draw
            for(i = 0; i < this.gameObjects.length; i++) {
                var obj = this.gameObjects[i];  
                if(typeof(obj.draw) === "function") {
                    obj.draw(this.playerCamera);
                    obj.draw(this.sideCamera);
                }
            }
        }
    }
    
    this.start = function() {
        console.log("game started");
        setInterval(function() { thisGame.gameLoop(); }, 1000 / FPS);
        
        menu.startMenu();
    }
}

var game = new Game();
game.start();
