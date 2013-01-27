var globalGraphics = new Graphics();

function Graphics() {
    // Textures
    this.barrierTexture = new Texture("terrain.png", 96, 64, 16, 16, 2, false);
    this.playerTexture = new Texture("terrain.png", 128, 112, 16, 16, 1, true);
    this.backgroundTexture = new Texture("terrain.png", 32, 16, 16, 16, 4, false);
    
    // Animations
    this.lostSoulStanding = new Animation("Doom-LostSoul.png",
                                    [66, 66], [15, 68], [32, 32], [47, 53], 5);
    this.trainerRunning = new Animation("trainersprites.png",
                                    [337, 353, 370], [6, 6, 6],
                                    [15, 16, 15], [18, 18, 17], 5);
                                    // 337 6 15 18; 353 6 16 18; 370 6 15 17
}

function Texture(fileName, x, y, width, height, scale, stretch) {
    this.file = new Image();
    this.file.src = fileName;
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

function Animation(fileName, xs, ys, widths, heights, fps) {
    this.fps = fps;
    this.file = new Image();
    this.file.src = fileName;
    this.xs = xs;
    this.ys = ys;
    this.widths = widths;
    this.heights = heights;
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