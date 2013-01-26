function Graphics() {
    this.barrierTexture = new Texture("terrain.png", 0, 0, 16, 16, 1);
}

function Texture(fileName, x, y, width, height, scale) {
    this.file = new Image();
    this.file.src = fileName;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scale = scale;
}

function fillTex(ctx, texture, x, y, width, height) {
    var finalWidth, finalHeight;
    var drawWidth = texture.width * texture.scale;
    var drawHeight = texture.height * texture.scale;
    var xTimes = Math.floor(width / drawWidth);
    var yTimes = Math.floor(height / drawHeight);
    for (var i = 0; i <= xTimes; i++) {
        for (var j = 0; j <= yTimes; j++) {
            finalWidth = drawWidth;
            finalHeight = drawHeight;
            if (i === xTimes) {
                finalWidth = drawWidth * (width / drawWidth - xTimes);
            }
            if (j === yTimes) {
                finalHeight = drawHeight * (height / drawHeight - yTimes);
            }
            ctx.drawImage(texture.file, texture.x, texture.y,
                            texture.width, texture.height,
                            x + i * drawHeight, y + j * drawWidth,
                            finalWidth, finalHeight);
        }
    }
}