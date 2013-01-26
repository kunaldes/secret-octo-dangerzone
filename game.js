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
        
        this.playerCamera = new InfiniCamera();
        this.playerCamera.setGameViewSize(playerCameraWidth, canvas.height);
        this.playerCamera.setScreenSize(canvas.width - sideCameraWidth, canvas.height);
        this.playerCamera.setScreenPosition(sideCameraWidth, 0);
        
        this.sideCamera = new BaseCamera();
        this.sideCamera.setScreenPosition(0, canvas.height/2);
        this.sideCamera.setGameViewSize(playerCameraWidth, canvas.height);
        this.sideCamera.setScreenSize(sideCameraWidth, canvas.height/2);
        
        this.cameras = [this.playerCamera, this.sideCamera];
    }
    
    this.initGame = function() {
        state = "game";
        
        this.initCameras();
        
        this.player = new Player();
        this.player.x = 0;
        this.player.y = canvas.height / 2 - this.player.height / 2;
        this.player.xSpeed = 4;
        
        this.gameObjects = [];
        this.gameObjects.push(this.player);
        
        this.obstacleManager = new ObstacleManager(this);
        
        var thisGame = this;

        canvas.addEventListener("mousemove", function(evt) { moveHandler(evt, thisGame); });
    }
    
    this.addGameObj = function(obj) {
        this.gameObjects.push(obj);
    }
    
    this.removeGameObj = function(obj) {
        var index = this.gameObjects.indexOf(obj);
        this.gameObjects.splice(index, 1); //delete from array
    };
    
    this.isBehindPlayerView = function(obj) {
        return obj.x < this.player.x - this.playerCamera.gameViewWidth / 2;
    }
    
    this.handlePlayerCollision = function(obj) {
        if(obj.isDeadly) {
            this.player.x = 0;
            this.player.resetSize();
            this.obstacleManager.reset();
        }
        else if(typeof(obj.handleCollision) === "function") {
            obj.handleCollision(this.player);
        }
        if(obj.isPellet)
            this.obstacleManager.removePellet(obj);
    }
    
    this.gameLoop = function() {
        loopCount++;
        ctx.clearRect(0, 0, 800, 600);
        
        if (state === "menu") {
            menu.draw();
        }
        else if (state === "game") {
            //update
            var i, j;
            
            for(i = 0; i < this.gameObjects.length; i++) {
                var obj = this.gameObjects[i];                
                if(typeof(obj.update) === "function")
                    obj.update();
            }
            
            //check collisions
            for(i = 0; i < this.gameObjects.length; i++) {
                var obj = this.gameObjects[i];
                if(obj === this.player) continue;
                if(utils.doesIntersect(this.player, obj)) {
                    this.handlePlayerCollision(obj);
                }
            }
            
            this.obstacleManager.update();
            
            this.playerCamera.centerViewOn(this.player);
            this.sideCamera.setGamePosition(this.playerCamera.gameX, this.sideCamera.gameY);
            
            //draw
            for(i = 0; i < this.cameras.length; i++) {
                var camera = this.cameras[i];
                camera.baseTransformation(ctx);
                for(j = 0; j < this.gameObjects.length; j++) {
                    var obj = this.gameObjects[j];
                    if(typeof(obj.draw) === "function") {
                        camera.objectTransform(ctx, obj);
                        obj.draw(ctx);
                        camera.restoreObjectTransform(ctx);
                    }
                }
                camera.restoreBaseTransformation(ctx);
            }
        }
    }
    
    this.start = function() {
        console.log("game started");
        setInterval(function() { thisGame.gameLoop(); }, 1000 / FPS);
        
        menu.startMenu();
    }
}

function ObstacleManager(game) {
    this.numObstacles = 20;
    var numPelletsPerObstacle = 10;
    this.obstacles = [];
    this.pellets = [];
    
    var startX = 400;
    var spaceBetween = 400;
    
    var width = 10;
    
    this.addObstacle = function(x) { 
        var newObstacle = Barrier.createColumnObstacle(this.obstaclesGenerated / (this.numObstacles - 1), x);
        this.obstacles.push(newObstacle);
        game.addGameObj(newObstacle.top);
        game.addGameObj(newObstacle.bottom);
    }
    
    this.addPellets = function(x) {
        var pelletGroup = [];
        for(var i = 0; i < numPelletsPerObstacle; i++) {
            var pellet = new Pellet();
            pellet.x = x + Math.random() * (spaceBetween - pellet.width);
            pellet.y = Math.random() * (canvas.height - pellet.height);
            pelletGroup.push(pellet);
            game.addGameObj(pellet);
        }
        this.pellets.push(pelletGroup);
    }
    
    this.fillObstacles = function() {
        while (this.obstacles.length < this.numObstacles) {
            var x = spaceBetween * this.obstaclesGenerated + startX;
            this.addObstacle(x);
            this.addPellets(x - spaceBetween);
            this.obstaclesGenerated++;
        }
    }
    
    this.update = function() {
        for(var i = this.obstacles.length - 1; i >= 0; i--) {
            var obstacle = this.obstacles[i];
            if(game.isBehindPlayerView(obstacle.top)) {
                this.obstacles.splice(i, 1);
                game.removeGameObj(obstacle.top);
                game.removeGameObj(obstacle.bottom);
                
                var pelletGroup = this.pellets[i];
                for(var j = 0; j < pelletGroup.length; j++)
                    game.removeGameObj(pelletGroup[j]);
                this.pellets.splice(i, 1);
            }
        }
        this.fillObstacles();
    };
    
    this.removePellet = function(pellet) {
        for(var i = 0; i < this.pellets.length; i++) {
            var pelletGroup = this.pellets[i];
            for(var j = 0; j < pelletGroup.length; j++) {
                if(pelletGroup[j] == pellet) {
                    pelletGroup.splice(j, 1);
                    game.removeGameObj(pellet);
                    break;
                }
            }
        }
    }
    
    this.reset = function() {
        for(var i = 0; i < this.obstacles.length; i++) {
            var obstacle = this.obstacles[i];
            game.removeGameObj(obstacle.top);
            game.removeGameObj(obstacle.bottom);
        }
        this.obstacles = [];
        this.obstaclesGenerated = 0;
        
        for(i = 0; i < this.pellets.length; i++) {
            var pelletGroup = this.pellets[i];
            for(var j = 0; j < pelletGroup.length; j++)
                game.removeGameObj(pelletGroup[j]);
        }
        this.pellets = [];
        
        this.fillObstacles();
    }
    
    this.reset();
}


var game = new Game();
game.start();
