/*
    objects.js
    
    Authors:
    Joseph Carlos (jcarlos)
    Kunal Desai (kunald)
    James Grugett (jgrugett)
*/

function makeIntoGameObject(obj) {
    obj.x = 0;
    obj.y = 0;
    obj.width = 0;
    obj.height = 0;
    
    obj.isDeadly = false;
    obj.isPellet = false;
}

function Player() {
    makeIntoGameObject(this);
    this.width = 10;
    this.height = 10;
    
    this.counter = 0;
    
    this.xSpeed = 0;
    this.xAcceleration = 0.002;
    
    this.speedMultiplier = 1;
    
    this.animation = 0;
    this.animations = [];
    this.animations.push(globalGraphics.trainerWalking);
    this.animations.push(globalGraphics.trainerRunning);
    this.animations.push(globalGraphics.trainerBiking);
    this.animations.push(globalGraphics.playerExploding);
    this.animationElapsedTime = 0;
    this.animationReset = 0;
    
    this.setAnimation = function (n, resetn) {
        if (resetn === undefined) {
            this.animationReset = n;
        } else {
            this.animationReset = resetn;
        }
        this.animation = n;
        this.animationElapsedTime = 0;
    }
    
    this.draw = function(ctx) {
        var currentAnimation = this.animations[this.animation];
        var animationDelay = Math.floor(FPS / currentAnimation.fps);
        var animationFrames = currentAnimation.xs.length;
        var elapsedTime = this.animationElapsedTime;
        var iter = Math.floor((elapsedTime) / animationDelay);
        var aX = 0;
        var aY = 0;
        var aWidth = this.width;
        var aHeight = this.height;
        if (this.animation === 3) {
            aWidth = this.width * 3;
            aHeight = this.height * 3;
            aX -= this.width / 2;
            aY -= this.height / 2;
        }
        ctx.drawImage(currentAnimation.file, currentAnimation.xs[iter],
                        currentAnimation.ys[iter],
                        currentAnimation.widths[iter],
                        currentAnimation.heights[iter],
                        aX, aY, aWidth, aHeight);
                        
        if (elapsedTime === (animationDelay * animationFrames - 1)) {
            this.animationElapsedTime = 0;
            this.animation = this.animationReset;
        } else {
            this.animationElapsedTime++;
        }
    };
    
    this.update = function() {
        this.x += this.xSpeed * this.speedMultiplier * 60 / FPS;
        this.xSpeed += this.xAcceleration * 60 / FPS;
        this.counter++;
        
        var prevWidth = this.width;
        var prevHeight = this.height;
        this.width = 10 * Math.exp(this.counter / FPS);
        this.height = 10 * Math.exp(this.counter / FPS);
        this.x -= (this.width - prevWidth) / 2;
        this.y -= (this.height - prevHeight) / 2;
    };
    
    this.reset = function() {
        var prevHeight = this.height;
        this.width = 10;
        this.height = 10;
        this.counter = 0;
        this.y += (prevHeight - this.height) / 2;
        
        this.xSpeed = 5;
    }
}

function Background(width, height) {
    makeIntoGameObject(this);
    this.width = width;
    this.height = height;
    this.isDeadly = false;
    
    this.draw = function(ctx) {
        fillTex(ctx, globalGraphics.sandTexture, 0, 0,
                this.width, this.height);
    };
    
    
}
Background.createBackground = function(x) {
        var width = 400;
        var heightBeyondScreen = 0;//canvas.height / 2;
        var background = new Background(width, canvas.height);
        background.x = x;
        background.y = -heightBeyondScreen;
        return background;
    }

function Barrier(width, height) {
    makeIntoGameObject(this);
    this.width = width;
    this.height = height;
    this.isDeadly = true;
    
    this.draw = function(ctx) {
        fillTex(ctx, globalGraphics.barrierTexture, 0, 0,
                this.width, this.height);
    };
}

Barrier.createColumnObstacle = function(progress, x) {
    var width = 32;
    var maxGap = 180;
    var minGap = 170;
    
    var heightBeyondScreen = canvas.height / 2;
    
    //generate gap
    var randomFactor = Math.random() * .5 + .75;
    
    var gapHeight = maxGap - progress * randomFactor * (maxGap - minGap);
    var gapStartY = Math.random() * (canvas.height - gapHeight);
    
    var topBarrier = new Barrier(width, gapStartY + heightBeyondScreen);
    topBarrier.x = x;
    topBarrier.y = -heightBeyondScreen;
        
    var bottomBarrier = new Barrier(width, canvas.height - gapHeight - gapStartY + heightBeyondScreen);
    bottomBarrier.x = x;
    bottomBarrier.y = gapStartY + gapHeight;
    
    return {top:topBarrier, bottom:bottomBarrier};
}

function Pellet() {
    makeIntoGameObject(this);
    var counter_dec = 0.37 * FPS;
    this.isPellet = true;
    
    this.width = 24;
    this.height = 24;
    
    this.draw = function(ctx) {
        fillTex(ctx, globalGraphics.pelletTexture, 0, 0,
                this.width, this.height);
    };
    
    this.handleCollision = function(player) {
        player.counter -= counter_dec;
    }
}

function ParticleObject(x, y, angle, magnitude, opacityMult) {
    makeIntoGameObject(this);
    this.alpha = 1.0;
    this.x = x;
    this.y = y;
    this.xVel = Math.cos(angle) * magnitude;
    this.yVel = Math.sin(angle) * magnitude;
    this.opacityMult = opacityMult;
    
    this.width = 5;
    this.height = 5;
    
    this.isVisible = true;
    
    this.draw = function(ctx) {
        ctx.fillStyle = "black";
        ctx.globalAlpha = this.alpha;
        ctx.fillRect(0,0,this.width,this.height);
        ctx.globalAlpha = 1.0;
    }
    
    this.update = function() {
        this.x += this.xVel * 60 / FPS;
        this.y += this.yVel * 60 / FPS;
        this.alpha *= this.opacityMult;
        
        if (this.alpha < 0.001) {
            this.isVisible = false;
        }
    }
}

function ScoreLabel(score, ctx) {
    makeIntoGameObject(this);
    var myText = "You scored: " + score;
    ctx.font = "18px Arial";
    this.width = ctx.measureText(myText).width + 10;
    this.height = 30;
        
    this.draw = function(ctx) {
        ctx.font = "18px Arial";
        ctx.fillStyle = "#483C32";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = "white";
        ctx.fillText(myText, 5, this.height / 2 + 5);
    }
    
    this.update = function() {
        this.x += 3.5;
    }
}
