var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var FPS = 60;

function Menu(startGameCallback) {
    var startColor = "#4499FF";
    
    var bX = 300;
    var bY = 400;
    var bWidth = 200;
    var bHeight = 70;
    
    var drawMenuBackground = function() {
        var width = 800;
        var height = 600;
        var cactusWidth = 64;
        fillTex(ctx, globalGraphics.backgroundTexture, 0, 0,
                    width, height);

        // Cacti
        fillTex(ctx, globalGraphics.cactusTexture, 0.1 * width,
                    height * (0.6), cactusWidth, height * (0.4));
        fillTex(ctx, globalGraphics.cactusTexture, 0.1 * width - cactusWidth * 1.1,
                    height * 0.75, cactusWidth, height * 0.25);
        fillTex(ctx, globalGraphics.cactusTexture, 0.1 * width + cactusWidth * 1.1,
                    height * 0.85, cactusWidth, height * 0.15);
        fillTex(ctx, globalGraphics.cactusTexture, 0.9 * width,
                    height * 0.4, cactusWidth, height * 0.6);
        fillTex(ctx, globalGraphics.cactusTexture, 0.9 * width - cactusWidth * 1.1,
                    height * 0.65, cactusWidth, height * 0.35);

        // Caketi (?)
        var cakeHeight = 48;
        var cakeWidth = 48;
        var cakex = 0.5 * width;
        var cakey = 0.85 * height;
        fillTex(ctx, globalGraphics.pelletTexture, cakex, cakey,
                cakeWidth, cakeHeight);
        ctx.save();
        ctx.translate(cakeWidth * 1.1, cakeHeight * 0.75);
        fillTex(ctx, globalGraphics.pelletTexture, cakex, cakey,
                cakeWidth, cakeHeight);
        ctx.translate(0.1 * cakeWidth, -cakeHeight * 1.1);
        fillTex(ctx, globalGraphics.pelletTexture, cakex, cakey,
                cakeWidth, cakeHeight);
        ctx.restore();
    }
    
    this.draw = function() {
        drawMenuBackground();
        
        ctx.save();
        ctx.font = '60px "Trebuchet MS", Helvetica, sans-serif';
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText("Operation", canvas.width/2, 70);
        ctx.fillText("\"Desert Storm\"", canvas.width/2, 130);
        
        ctx.font = '20px "Trebuchet MS", Helvetica, sans-serif';
        ctx.fillText("You are being pursued by Saddam Hussein's troops on camel back.", canvas.width/2, 200);
        ctx.fillText("You have entered a cactus field and have but minutes to live.", canvas.width/2, 225);
        ctx.fillText("Good luck.", canvas.width/2, 250);
        
        ctx.fillText("Move your mouse up and down to move.", canvas.width/2, 310);
        ctx.fillText("Collect cakes to make yourself shrink.", canvas.width/2, 335);
        ctx.fillText("Hold down the mouse to ride your bike.", canvas.width/2, 360);
        
        
        ctx.fillStyle = startColor;
        ctx.fillRect(bX, bY, bWidth, bHeight);
        ctx.strokeRect(bX, bY, bWidth, bHeight);
        
        ctx.fillStyle = "black";
        ctx.font = '55px "Arial Black", Gadget, sans-serif';
        ctx.fillText("PLAY!", canvas.width/2, 455)
        ctx.restore();
    }
    
    var moveHandler = function(evt) {
        var x = evt.pageX - canvas.offsetLeft;
        var y = evt.pageY - canvas.offsetTop;
        
        if (x > bX && x < bX + bWidth && y > bY && y < bY + bHeight) {
            startColor = "#FF5511";
        } else {
            startColor = "#1199FF";
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
        if (evt.keyCode === 65) {
            this.aKeyDown = true;
        }
    }
    
    this.onKeyUp = function(evt) {
        if (evt.keyCode === 65) {
            this.aKeyDown = false;
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
        var maxY = canvas.height - this.player.height - 10;
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
    }
    
    this.onMouseUp = function(evt) {
        this.mouseDown = false;
        if(this.gameIsOver) return;
        this.player.setAnimation(0);
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
        
        this.gameBackgrounds = [];
        var firstBackground = new Background(this.playerCamera.gameViewWidth,
                                             this.playerCamera.gameViewHeight);
        firstBackground.x = -this.playerCamera.gameViewWidth/2;
        firstBackground.y = this.playerCamera.gameY;
        this.gameBackgrounds.push(firstBackground);
        
        this.obstacleManager = new ObstacleManager(this);
        
        canvas.addEventListener('keydown', function(evt) { thisGame.onKeyDown(evt); } );
        canvas.addEventListener('keyup', function(evt) { thisGame.onKeyUp(evt); } );
        canvas.addEventListener("mousemove", function(evt) { thisGame.onMouseMove(evt); });
        canvas.addEventListener("mousedown", function(evt) { thisGame.onMouseDown(evt); });
        canvas.addEventListener("mouseup", function(evt) { thisGame.onMouseUp(evt); });
        canvas.setAttribute('tabindex','0');
        canvas.focus();
        
        this.prevTime = new Date().getTime();
    }
    
    this.addGameObj = function(obj) {
        this.gameObjects.push(obj);
    }
    
    this.removeGameObj = function(obj) {
        var index = this.gameObjects.indexOf(obj);
        this.gameObjects.splice(index, 1); //delete from array
    };
    
    this.addGameBackground = function(obj) {
        this.gameBackgrounds.push(obj);
    }
    
    this.removeGameBackground = function(obj) {
        var index = this.gameBackgrounds.indexOf(obj);
        this.gameBackgrounds.splice(index, 1); //delete from array
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
            if(thisGame.scoreLabel !== undefined)
                this.removeGameObj(thisGame.scoreLabel);
            
            setTimeout(function() {
                thisGame.scoreLabel = new ScoreLabel(Math.round(thisGame.player.x), ctx);
                
                thisGame.gameIsOver = false;
                thisGame.player.x = 0;
                thisGame.player.reset();
                thisGame.obstacleManager.reset();
                if(thisGame.mouseDown)
                    thisGame.player.setAnimation(2);
                else
                    thisGame.player.setAnimation(0);
                
                thisGame.scoreLabel.x = thisGame.player.x - thisGame.scoreLabel.width - 5;
                thisGame.scoreLabel.y = thisGame.playerCamera.gameViewHeight / 2 - thisGame.scoreLabel.height / 2;
                thisGame.addGameObj(thisGame.scoreLabel);
                
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
        var currTime = new Date().getTime();
        this.currFPS = 1000 / (currTime - this.prevTime);
        this.prevTime = currTime;
        
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
            if(!this.gameIsOver)
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
            
            // draw backgrounds
            for(i = 0; i < this.cameras.length; i++) {
                var camera = this.cameras[i];
                camera.baseTransformation(ctx);
                for(j = 0; j < this.gameBackgrounds.length; j++) {
                    var obj = this.gameBackgrounds[j];
                    if(typeof(obj.draw) === "function") {
                        camera.objectTransform(ctx, obj);
                        obj.draw(ctx);
                        camera.restoreObjectTransform(ctx);
                    }
                }
                camera.restoreBaseTransformation(ctx);
            }
            
            //draw game
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
            ctx.font = "12px Arial";
            var width = ctx.measureText("High Score: " + Math.max(score, highScore)).width;
            ctx.fillStyle = "#483C32";
            ctx.fillRect(10,10, width + 10, 40);
            ctx.fillStyle = "white";
            ctx.fillText("Score: " + score, 15, 27);
            ctx.fillText("High Score: " + highScore, 15, 40);
            if (score > highScore) {
                highScore = score;
            }
            
            if(this.aKeyDown) {
                var y = 75;
                var str = "FPS " + Math.round(this.currFPS);
                var width = ctx.measureText(str).width;
                ctx.fillStyle = "#483C32";
                ctx.fillRect(10, y - 15, width + 10, 20);
                ctx.fillStyle = "white";
                ctx.fillText(str, 15, y);
            }
        }
    }
    
    this.start = function() {
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
    
    this.backgrounds = [];
    
    this.addBackground = function(x) {
        var newBackground = Background.createBackground(x);
        this.backgrounds.push(newBackground);
        game.addGameBackground(newBackground);
    }
    
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
            this.addBackground(x - spaceBetween);
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
                
                var background = this.backgrounds[i];
                game.removeGameBackground(background);
                this.backgrounds.splice(i, 1);
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
        
        for(i = 0; i < this.backgrounds.length; i++) {
            game.removeGameBackground(this.backgrounds[i]);
        }
        this.backgrounds = [];
        
        this.fillObstacles();
    }
    
    this.reset();
}


var game = new Game();
game.start();
