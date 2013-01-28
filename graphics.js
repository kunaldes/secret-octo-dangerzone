var globalGraphics = new Graphics();

function Graphics() {
    this.addImage = function(source) {
        this.images[source] = new Image();
        this.images[source].src = source;
    }

    // Images
    this.images = {};
    this.addImage("terrain.png");
    this.addImage("Doom-LostSoul.png");
    this.addImage("trainersprites.png");
    this.addImage("sand2.png");
        
    var terrain = this.images["terrain.png"];
    var lostSoul = this.images["Doom-LostSoul.png"];
    var trainer = this.images["trainersprites.png"];
    var sand = this.images["sand2.png"];
        
    // Textures
    this.barrierTexture = new Texture(terrain, 96, 64, 16, 16, 2, false);
    this.cactusTexture = new Texture(terrain, 96, 64, 16, 16, 4, false);
    this.playerTexture = new Texture(terrain, 128, 112, 16, 16, 1, true);
    this.backgroundTexture = new Texture(terrain, 32, 16, 16, 16, 4, false);
    this.pelletTexture = new Texture(terrain, 192, 128, 16, 16, 1, true);
    this.sandTexture = new Texture(sand, 0, 0, 96, 96, 4, false);
    
    // Animations
    this.lostSoulStanding = new Animation(lostSoul,
        [66, 66], [15, 68], [32, 32], [47, 53], 5);
    this.trainerRunning = new Animation(trainer,
        [337, 353, 370], [6, 6, 6], [15, 16, 15], [18, 18, 17], 5);
    this.trainerWalking = new Animation(trainer,
        [148, 164, 180], [6, 7, 7], [14, 14, 14], [19, 18, 18], 5);
    this.trainerBiking = new Animation(trainer,
        [102, 123], [116, 116], [20, 20], [22, 22], 5);
    this.playerExploding = new Animation(lostSoul,
        [197, 274, 373], [292, 293, 280], [68, 88, 103], [60, 72, 90], 3);
}

function drawMenuBackground(ctx) {
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

function newImage(source) {
    var img = new Image();
    img.src = source;
    return img;
}

function Texture(file, x, y, width, height, scale, stretch) {
    this.file = file;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.stretch = stretch;
}

function fillTex(ctx, texture, x, y, width, height) {
    if (texture.stretch) {
        ctx.drawImage(texture.file, texture.x, texture.y,
                        texture.width, texture.height, x, y, width, height);
        return;
    }
    var drawWidth = texture.width * texture.scale;
    var drawHeight = texture.height * texture.scale;
    var xRatio = width / drawWidth;
    var yRatio = height / drawHeight;
    var upperCols = Math.ceil(xRatio);
    var upperRows = Math.ceil(yRatio);
    var lowerCols = Math.floor(xRatio);
    var lowerRows = Math.floor(yRatio);
    var rows = lowerRows;
    var cols = lowerCols;
    if ((upperCols - xRatio) < (xRatio - lowerCols)) {
        cols = upperCols;
    }
    if ((upperRows - yRatio) < (yRatio - lowerRows)) {
        rows = upperRows;
    }
    if (cols === 0) {
        cols = 1;
    }
    if (rows === 0) {
        rows = 1;
    }
    drawWidth = width / cols
    drawHeight = height / rows
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            ctx.drawImage(texture.file, texture.x, texture.y,
                            texture.width, texture.height,
                            x + col * drawWidth, y + row * drawHeight,
                            drawWidth, drawHeight);
        }
    }
}

function Animation(file, xs, ys, widths, heights, fps) {
    this.fps = fps;
    this.file = file;
    this.xs = xs;
    this.ys = ys;
    this.widths = widths;
    this.heights = heights;
    
    this.duration = function() {
        return this.fps * this.xs.length;
    }
}

function tileTex(ctx, texture, x, y, width, height) {
    var finalWidth, finalHeight, endWidth, endHeight, endTexWidth, endTexHeight;
    var finalTexWidth, finalTexHeight;
    var drawWidth, drawHeight;
    if (texture.stretch) {
        drawWidth = width;
        drawHeight = height;
    } else {
        drawWidth = texture.width * texture.scale;
        drawHeight = texture.height * texture.scale;
    }
    var xTimes = Math.floor(width / drawWidth);
    var yTimes = Math.floor(height / drawHeight);
    endTexWidth = texture.width * (width / drawWidth - xTimes);
    endTexHeight = texture.height * (height / drawHeight - yTimes);
    endWidth = drawWidth * (width / drawWidth - xTimes);
    endHeight = drawHeight * (height / drawHeight - yTimes);
    for (var i = 0; i <= xTimes; i++) {
        for (var j = 0; j <= yTimes; j++) {
            finalWidth = drawWidth;
            finalHeight = drawHeight;
            finalTexWidth = texture.width;
            finalTexHeight = texture.height;
            if (i === xTimes) {
                finalWidth = endWidth;
                finalTexWidth = endTexWidth;
            }
            if (j === yTimes) {
                finalHeight = endHeight;
                finalTexHeight = endTexHeight;
            }
            ctx.drawImage(texture.file, texture.x, texture.y,
                            finalTexWidth, finalTexHeight,
                            x + i * drawWidth, y + j * drawHeight,
                            finalWidth, finalHeight);
        }
    }
}
