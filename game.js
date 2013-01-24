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
                    player.x = 0; //jump to beginning, can change later
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
    
    var initBarriers = function() {
        var barriers = [];
        var numObstacles = 25;
        var width = 10;
        var maxGap = 160;
        var minGap = 30;
        var xStart = 400;
        var xSpread = 400;
        var gapPosition = 10;
        var heightBeyondScreen = canvas.height / 2;
        
        for(var i = 0; i < numObstacles; i++) {
            var progress = (numObstacles - i) / (numObstacles - 1);
            var gap = minGap + progress * (maxGap - minGap);
            //randomize the gap position:
            gapPosition = (gapPosition * 12453321 + 31) % canvas.height;
            if(gapPosition > canvas.height - gap)
                gapPosition = canvas.height - gap;
                
            var topBarrier = new Barrier(width, gapPosition + heightBeyondScreen);
            topBarrier.x = xSpread * i + xStart;
            topBarrier.y = -heightBeyondScreen;
            
            var bottomBarrier = new Barrier(width, canvas.height - gap - gapPosition + heightBeyondScreen);
            bottomBarrier.x = xSpread * i + xStart;
            bottomBarrier.y = gapPosition + gap;
            
            barriers.push(topBarrier);
            barriers.push(bottomBarrier);
        }
        
        return barriers;
    }
    
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
        
        var barriers = initBarriers();
        
        this.gameObjects.push(player);
        this.gameObjects = this.gameObjects.concat(barriers);
        
        var thisGame = this;
        canvas.addEventListener("mousemove", function(evt) { moveHandler(evt, thisGame); });
    }
    
    this.start = function() {
        console.log("game started");
        setInterval(gameLoop, 1000 / FPS);
    }
}

var game = new Game();
game.start();
