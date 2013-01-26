var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var FPS = 60;

function Menu(startGameCallback) {
    var startColor = "#0099FF";
    var helpColor = "#0099FF";
    
    var bX = 200;
    var bY = 100;
    var bWidth = 400;
    var bHeight = 150;
    var bPadding = 50;
    
    var particles = [];
    
    this.draw = function() {
        ctx.fillStyle = startColor;
        ctx.fillRect(bX, bY, bWidth, bHeight);
        
        ctx.fillStyle = helpColor;
        ctx.fillRect(bX, bY + bHeight + bPadding, bWidth, bHeight);
        
        for (var i = particles.length - 1; i >= 0; i--){
            if (particles[i].update(1)) {
                particles[i].draw(ctx);
            } else {
                particles.splice(i, 1);
            }
        };
    }
    
    var moveHandler = function(evt) {
        var x = evt.pageX - canvas.offsetLeft;
        var y = evt.pageY - canvas.offsetTop;
        
        if (x > bX && x < bX + bWidth && y > bY && y < bY + bHeight) {
            startColor = "#FF3200";
        } else {
            startColor = "#0099FF";
        }
        
        if (x > bX && x < bX + bWidth && y > bY + bHeight + bPadding && y < bY + 2*bHeight + bPadding) {
            helpColor = "#FF3200";
        } else {
            helpColor = "#0099FF";
        }
    }
    
    var clickHandler = function(evt) {
        var x = evt.pageX - canvas.offsetLeft;
        var y = evt.pageY - canvas.offsetTop;
        
        if (x > bX && x < bX + bWidth && y > bY && y < bY + bHeight) {
            canvas.removeEventListener("mousemove", moveHandler);
            canvas.removeEventListener("mousedown", clickHandler);
            startGameCallback();
        } else {
            for(var i = 0; i < 100; i++) { 
                particles.push(new Particle(x, y, Math.random() * Math.PI*2, Math.random() * 15, 0, .5, 0.9));
            }
        }
    }
    
    this.startMenu = function() {
        canvas.addEventListener("mousemove", moveHandler);
        canvas.addEventListener("mousedown", clickHandler);
    }
}


function Game() {
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
                    obj.handleCollision(this.player);
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
