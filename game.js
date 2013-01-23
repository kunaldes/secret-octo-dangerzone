var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var game = function() {
    var exports = {};
    
    var FPS = 60;
    var i = 0;
    function gameLoop() {
        i = (i + 1) % FPS;
        
        ctx.clearRect(0, 0, 800, 600);
        ctx.fillStyle = "orange";
        ctx.fillRect(300 + i * 2,200, 100, 100);
    }
    
    exports.start = function() {
        console.log("game started");
        setInterval(gameLoop, 1000/FPS);
    }
    
    return exports;
}();

game.start();