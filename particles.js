function Particle(x, y, angle, magnitude, gravityX, gravityY, opacity) {
    this.x = x;
    this.y = y;
    this.xVel = Math.cos(angle) * magnitude;
    this.yVel = Math.sin(angle) * magnitude;
    this.gravityX = gravityX;
    this.gravityY = gravityY;
    this.opacityMult = opacity;
    this.opacity = 1;
    
    this.update = function(dt) {
        this.x += this.xVel * dt;
        this.y += this.yVel * dt;
        this.xVel += this.gravityX * dt;
        this.yVel += this.gravityY * dt;
        this.opacity *= this.opacityMult;
        
        if (this.opacity < 0.001) {
            return false;
        } else {
            return true;
        }
    }
    
    this.draw = function(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0," + this.opacity + ")";
        ctx.fillRect(this.x, this.y, 5, 5);
    }
    
}
