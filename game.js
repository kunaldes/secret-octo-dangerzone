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
    var highScore = 0;
    this.mouseDown = false;
    
    var menu = new Menu(function() {
        thisGame.initGame();
    });
    
    this.onKeyDown = function(evt) {
        console.log(evt.keyCode);
        if (evt.keyCode === 65) {
            this.player.setAnimation(3, 0);
        }
    }
    
    this.onMouseMove = function(evt) {
        if(this.gameIsOver) return;
        var x = evt.pageX - canvas.offsetLeft;
        var y = evt.pageY - canvas.offsetTop;
        
        //set player y
        var scaleY = canvas.height / this.playerCamera.screenHeight;
        var playerY = scaleY * y - this.player.height / 2;
        
        var minY = 0;
        var maxY = canvas.height - this.player.height;
        playerY = Math.max(minY, playerY);
        playerY = Math.min(maxY, playerY);
        
        this.player.y = playerY; 
    }
    
    this.onMouseDown = function(evt) {
        if (!this.mouseDown) {
            this.mouseDown = true;
        }
        
        if(this.gameIsOver) return;
        this.player.setAnimation(2);
        console.log("mouse Down");
    }
    
    this.onMouseUp = function(evt) {
        this.mouseDown = false;
        if(this.gameIsOver) return;
        this.player.setAnimation(0);
        console.log("mouse up");
    }
    
    this.initCameras = function() {
        var bottomCameraHeight = 100;
        var playerCameraHeight = canvas.height - bottomCameraHeight;
        
        this.playerCamera = new InfiniCamera();
        this.playerCamera.setGameViewSize(canvas.width, canvas.height);
        this.playerCamera.setScreenSize(canvas.width, playerCameraHeight);
        this.playerCamera.setScreenPosition(0, 0);
        
        this.bottomCamera = new BaseCamera();
        this.bottomCamera.setGamePosition(0, 0);
        this.bottomCamera.setGameViewSize(canvas.width * 5, canvas.height);
        this.bottomCamera.setScreenSize(canvas.width, bottomCameraHeight);
        this.bottomCamera.setScreenPosition(0, canvas.height - bottomCameraHeight);
        
        this.cameras = [this.playerCamera, this.bottomCamera];
    }
    
    this.initGame = function() {
        state = "game";
        
        this.gameIsOver = false;
        this.initCameras();
        
        this.player = new Player();
        this.player.x = 0;
        this.player.y = canvas.height / 2 - this.player.height / 2;
        this.player.xSpeed = 4;
        
        this.gameObjects = [];
        
        this.obstacleManager = new ObstacleManager(this);
        
        canvas.addEventListener('keydown', function(evt) { thisGame.onKeyDown(evt); } );
        canvas.addEventListener("mousemove", function(evt) { thisGame.onMouseMove(evt); });
        canvas.addEventListener("mousedown", function(evt) { thisGame.onMouseDown(evt); });
        canvas.addEventListener("mouseup", function(evt) { thisGame.onMouseUp(evt); });
        canvas.setAttribute('tabindex','0');
        canvas.focus();
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
        if(this.gameIsOver) return;
        if(obj.isDeadly) {
            this.explosionSound = new Audio("explosion.wav");
            this.explosionSound.play();
            this.player.setAnimation(3, 0);
            this.player.xSpeed = 0;
            this.gameIsOver = true;
            
            console.log(this.player.animations[3], this.player.animations[3].duration() * 50);
            
            setTimeout(function() {
                thisGame.gameIsOver = false;
                thisGame.player.x = 0;
                thisGame.player.reset();
                thisGame.obstacleManager.reset();
            }, this.player.animations[3].duration() * 50);
        }
        else if(typeof(obj.handleCollision) === "function") {
            obj.handleCollision(this.player);
        }
        if(obj.isPellet) {
            this.obstacleManager.removePellet(obj);
            this.eatSound = new Audio("eat.wav");
            this.eatSound.play();
        }
    }
    
    this.gameLoop = function() {
        loopCount++;
        ctx.clearRect(0, 0, 800, 600);
        
        if (state === "menu") {
            menu.draw();
        }
        else if (state === "game") {
            var i, j;
            
            if(this.mouseDown)
                this.player.speedMultiplier = 2;
            else
                this.player.speedMultiplier = 1;
            
            //update
            for(i = 0; i < this.gameObjects.length; i++) {
                var obj = this.gameObjects[i];                
                if(typeof(obj.update) === "function")
                    obj.update();
            }
            this.player.update();
            
            //check collisions
            for(i = 0; i < this.gameObjects.length; i++) {
                var obj = this.gameObjects[i];
                if(utils.doesIntersect(this.player, obj)) {
                    this.handlePlayerCollision(obj);
                }
            }

            this.obstacleManager.update();
            
            var cameraY = this.playerCamera.gameY;
            this.playerCamera.centerViewOn(this.player);
            this.playerCamera.setGamePosition(this.playerCamera.gameX, cameraY);
            this.bottomCamera.setGamePosition(this.playerCamera.gameX, this.bottomCamera.gameY);
            
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
                camera.objectTransform(ctx, this.player);
                this.player.draw(ctx);
                camera.restoreObjectTransform(ctx);
                camera.restoreBaseTransformation(ctx);
            }

            ctx.save();
            ctx.rotate( - Math.PI / 2);
            fillTex(ctx, globalGraphics.barrierTexture, 
                        -this.playerCamera.screenHeight - 8, 0,
                        16, this.playerCamera.screenWidth);
            ctx.restore();
            
            var score = Math.round(this.player.x);
            var width = ctx.measureText("High Score: " + Math.max(score, highScore)).width;
            ctx.fillStyle = "#483C32";
            ctx.fillRect(10,10, width + 10, 40);
            ctx.fillStyle = "white";
            ctx.fillText("Score: " + score, 15, 27);
            ctx.fillText("High Score: " + highScore, 15, 40);
            if (score > highScore) {
                highScore = score;
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
    var numPelletsPerObstacle = 8;
    var numParticlesPerPellet = 20;
    var maxParticleSpeed = 10;
    var particleOpacityMult = .9;
    var startX = 800;
    var spaceBetween = 400;
    var pelletSpawnMargin = 75;
    
    this.obstacles = [];
    this.pellets = [];
    this.particles = [];
    
    
    
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
            var pelletSpawnWidth = spaceBetween - pelletSpawnMargin * 2;
            var pelletSpawnHeight = canvas.height - pelletSpawnMargin * 2;
            pellet.x = x + pelletSpawnMargin + Math.random() * pelletSpawnWidth;
            pellet.y = pelletSpawnMargin + Math.random() * pelletSpawnHeight;
            pelletGroup.push(pellet);
            game.addGameObj(pellet);
        }
        this.pellets.push(pelletGroup);
    }
    
    this.addParticles = function(x, y) {
        for (var i = 0; i < numParticlesPerPellet; i++) {
            var parti = new ParticleObject(x, y, Math.random() * Math.PI * 2, Math.random() * maxParticleSpeed, particleOpacityMult);
            this.particles.push(parti);
            game.addGameObj(parti);
        }
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
        
        for (var i = this.particles.length-1; i >= 0; i--) {
            var parti = this.particles[i]
            if (!parti.isVisible || game.isBehindPlayerView(parti)) {
                this.particles.splice(i, 1);
                game.removeGameObj(parti);
            }
        }
    };
    
    this.removePellet = function(pellet) {
        this.addParticles(pellet.x, pellet.y);
        for(var i = 0; i < this.pellets.length; i++) {
            var pelletGroup = this.pellets[i];
            for(var j = 0; j < pelletGroup.length; j++) {
                if(pelletGroup[j] === pellet) {
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
        
        for(i = 0; i < this.particles.length; i++) {
            game.removeGameObj(this.particles[i]);
        }
        this.particles = [];
        
        this.fillObstacles();
    }
    
    this.reset();
}


var game = new Game();
game.start();
