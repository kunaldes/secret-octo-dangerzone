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
    this.width = 20;
    this.height = 20;
    
    this.xSpeed = 0;
    this.xAcceleration = 0.002;
    this.ySpeed = 0;
    this.yAcceleration = 0;
    
    this.speedMultiplier = 1;
    
    this.animation = 0;
    this.animations = [];
    this.animations.push(globalGraphics.trainerWalking);
    this.animations.push(globalGraphics.trainerRunning);
    this.animations.push(globalGraphics.trainerBiking);
    this.animationElapsedTime = 0;
    
    this.setAnimation = function (n) {
        this.animation = n;
        this.animationElapsedTime = 0;
    }
    
    this.draw = function(ctx) {
        var currentAnimation = this.animations[this.animation];
        var animationDelay = Math.floor(FPS / currentAnimation.fps);
        var animationFrames = currentAnimation.xs.length;
        var elapsedTime = this.animationElapsedTime;
        var iter = Math.floor((elapsedTime) / animationDelay);
        ctx.drawImage(currentAnimation.file, currentAnimation.xs[iter],
                        currentAnimation.ys[iter],
                        currentAnimation.widths[iter],
                        currentAnimation.heights[iter],
                        0, 0, this.width, this.height);
                        
        if (elapsedTime === (animationDelay * animationFrames - 1)) {
            this.animationElapsedTime = 0;
        } else {
            this.animationElapsedTime++;
        }
    };
    
    this.update = function() {
        this.x += this.xSpeed * this.speedMultiplier;
        this.xSpeed += this.xAcceleration;
        //this.xAcceleration *= .95;
        
        this.y += this.ySpeed;
        this.ySpeed += this.yAcceleration;
        this.yAcceleration *= .95;
        
        this.width *= 1.015;
        this.height *= 1.015;
    };
    
    this.reset = function() {
        this.width = 20;
        this.height = 20;
        
        this.xSpeed = 5;
    }
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
    var minGap = 160;
    
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
    var frac_amt = 0.7;
    this.isPellet = true;
    
    this.width = 24;
    this.height = 24;
    
    this.draw = function(ctx) {
        fillTex(ctx, globalGraphics.pelletTexture, 0, 0,
                this.width, this.height);
    };
    
    this.handleCollision = function(player) {
        var pWidth = player.width;
        var pHeight = player.height;
        
        player.width *= frac_amt;
        player.height *= frac_amt;
        
        player.x -= (player.width - pWidth) / 2;
        player.y -= (player.height - pHeight) / 2;
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
        this.x += this.xVel;
        this.y += this.yVel;
        this.alpha *= this.opacityMult;
        
        if (this.alpha < 0.001) {
            this.isVisible = false;
        }
    }
}
