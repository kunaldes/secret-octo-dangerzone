/*
    A messy attempt at getting a sprite attached to something like a game
    object. Contains code that displays a single Lost Soul (Doom monster) that
    can be controlled with the arrow keys, and exploded with the a key.
    
    Not much is currently in a "general" format (multiple sprite sheets/
    animations/animation format support) because I haven't gotten around
    to doing that yet. I wanted to actually get the damn thing running first.
    
    The code that gets the arrow keys is IMO pretty usable as is (onKeyUp/Down,
    computeHeading).
*/

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var keysDown = [false, false, false, false];

var intervalId;
var timerDelay = 75;
var quit = false;
var game_time = 0;

var upCode = 38;
var downCode = 40;
var leftCode = 37;
var rightCode = 39;
var aCode = 65;

var lostSoul1 = new lost_soul();

function almost_equal(n1, n2) {
    if (Math.abs(n1 - n2) < 0.0001) {
        return true;
    } else {
        return false;
    }
}

function get_facing(heading) {
    var h0_0 = almost_equal(heading[0], 0);
    var h1_0 = almost_equal(heading[1], 0);
    var h0_p = (heading[0] > 0);
    var h1_p = (heading[1] > 0);
    if (h0_0 && h1_0) {
        return 0;
    } else if (h0_0 && h1_p) {
        return 0;
    } else if (h0_p && h1_0) {
        return 2;
    } else if (h0_0 && !h1_p) {
        return 4;
    } else if (!h0_p && h1_0) {
        return 6;
    } else if (h0_p && h1_p) {
        return 1;
    } else if (h0_p && !h1_p) {
        return 3;
    } else if (!h0_p && h1_p) {
        return 7;
    } else if (!h0_p && !h1_p) {
        return 5;
    } else {
        return 0;
    }
}

function lost_soul() {
    this.sprite_sheet = "Doom-LostSoul.png";
    // Orientation: S, SE, E, NE, N
    this.facing_sx = [8, 63, 102, 140, 182];
    this.facing_sy = [6, 6, 6, 6, 6];
    this.facing_ex = [57, 102, 140, 182, 234];
    this.facing_ey = [63, 63, 63, 63, 63];
    
    this.a0_sx = [10, 77, 140, 195, 271, 371];
    this.a0_sy = [293, 293, 299, 290, 292, 277];
    this.a0_ex = [50, 116, 190, 266, 364, 476];
    this.a0_ey = [350, 350, 350, 353, 365, 372];
    
    this.heading = [0, 0];
    this.position = [200, 200];
    this.step = 10;
    
    this.animation = 0;
    this.animation_start_time = 0;
    
    this.start_animation = function(n) {
        if (this.animation === 0) {
            this.animation = n;
            this.animation_start_time = game_time;
        }
    }
    
    this.draw = function() {
        var x = this.position[0];
        var y = this.position[1];
        var sx, sy, ex, ey;
        var iter;
        var flip = false;
        if (this.animation !== 0) {
            var animation_delay = 2;
            var animation_frames = this.a0_sx.length;
            var elapsed_time = game_time - this.animation_start_time;
            if (elapsed_time === animation_delay * animation_frames) {
                this.animation = 0;
            }
            iter = Math.floor((elapsed_time - 1) / animation_delay);
            sx = this.a0_sx[iter];
            sy = this.a0_sy[iter];
            ex = this.a0_ex[iter];
            ey = this.a0_ey[iter];
        } else {
            var facing_temp = get_facing(this.heading);
            if (facing_temp > 4) {
                flip = true;
                if (facing_temp === 5) {
                    facing_temp = 3;
                } else if (facing_temp === 6) {
                    facing_temp = 2;
                } else if (facing_temp === 7) {
                    facing_temp = 1;
                }
                ctx.save();
                ctx.translate(400, 0);
                ctx.scale(-1, 1);
            }
            sx = this.facing_sx[facing_temp];
            sy = this.facing_sy[facing_temp];
            ex = this.facing_ex[facing_temp];
            ey = this.facing_ey[facing_temp];
        }
        var size_x = ex - sx;
        var size_y = ey - sy;
        if (flip) {
            x = 400 - x;
        }
        var dx = x - Math.floor(size_x / 2);
        var dy = y - Math.floor(size_y / 2);
        ctx.drawImage(lost_soul_sheet, sx, sy, size_x, size_y, dx, dy, 
                        size_x, size_y);
        if (flip) {
            ctx.restore();
            flip = false;
        }
    }
    
    this.move = function() {
        var old_position = this.position;
        this.position[0] += Math.floor(this.step * this.heading[0]);
        this.position[1] += Math.floor(this.step * this.heading[1]);
        if ((this.position[0] + 20 >= 400) || (this.position[0] <= 0)) {
            this.position[0] = old_position[0];
        }
        if ((this.position[1] + 20 >= 400) || (this.position[1] <= 0)) {
            this.position[1] = old_position[1];
        }
    }
}

function animate_lost_soul() {
	if (!lost_soul_animating) {
		lost_soul_animating = true;
		lost_soul_start_time = game_time;
	}
	var animation_delay = 2;
	var animation_frames = lost_soul_sx.length;
	var elapsed_time = game_time - lost_soul_start_time;
	if (elapsed_time === animation_delay * animation_frames) {
		lost_soul_animating = false;
		return;
	}
	draw_lost_soul(Math.floor(elapsed_time / animation_delay), rectLeft, 180);
}

// Starts the animation of a lost soul
function lost_soul_start_animate() {
    if (!lost_soul_animating) {
        lost_soul_animating = true;
		lost_soul_start_time = game_time;
    }
}

function redrawAll() {
    // erase everything -- not efficient, but simple!
    ctx.clearRect(0, 0, 400, 400);
    // Draws the lost soul, including animation
    lostSoul1.draw();
	ctx.font = "20px Arial";
    ctx.fillText("Press 'q' to quit.", 20, 40);
}

function onTimer() {
    if (quit) return;
	game_time += 1;
    lostSoul1.move();
    redrawAll();
}

function norm(v) {
    var s = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
    if (almost_equal(s, 0)) {
        return [0, 0];
    } else {
        return [v[0]/s, v[1]/s];
    }
}

function compute_heading() {
    var h = [0, 0];
    if (keysDown[0]) {
        h[1] -= 1;
    } 
    if (keysDown[1]) {
        h[1] += 1;
    }
    if (keysDown[2]) {
        h[0] -= 1;
    }
    if (keysDown[3]) {
        h[0] += 1;
    }
    return norm(h);
}

function onKeyDown(event) {
    if (quit) return;
    var curr_code = event.keyCode;
    var qCode = 81;
    var pCode = 80;
    if (curr_code === pCode) {
        // Debug key
        console.log(lostSoul1.heading);
    }
    if (curr_code === qCode) {
        clearInterval(intervalId);
        // ctx.clearRect(0, 0, 400, 400);
        ctx.fillStyle = "rgba(128,128,128,0.75)";
        ctx.fillRect(0, 0, 400, 400);
        quit = true;
    } else if ((curr_code === upCode) && (keysDown[0] === false)) {
        keysDown[0] = true;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === downCode) && (keysDown[1] === false)) {
        keysDown[1] = true;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === leftCode) && (keysDown[2] === false)) {
        keysDown[2] = true;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === rightCode) && (keysDown[3] === false)) {
        keysDown[3] = true;
        lostSoul1.heading = compute_heading();
    } else if (curr_code === aCode) {
        lostSoul1.start_animation(1);
    }
}

function onKeyUp(event) {
    if (quit) return;
    var curr_code = event.keyCode;
    if ((curr_code === upCode) && (keysDown[0] === true)) {
        keysDown[0] = false;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === downCode) && (keysDown[1] === true)) {
        keysDown[1] = false;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === leftCode) && (keysDown[2] === true)) {
        keysDown[2] = false;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === rightCode) && (keysDown[3] === true)) {
        keysDown[3] = false;
        lostSoul1.heading = compute_heading();
    }
}

function run() {
    canvas.addEventListener('keydown', onKeyDown, false);
    canvas.addEventListener('keyup', onKeyUp, false);
    // make canvas focusable, then give it focus!
    canvas.setAttribute('tabindex','0');
    canvas.focus();
    intervalId = setInterval(onTimer, timerDelay);
}

var lost_soul_sheet = new Image();
lost_soul_sheet.src = lostSoul1.sprite_sheet;
lost_soul_sheet.onload = function(){
	run();
	};
