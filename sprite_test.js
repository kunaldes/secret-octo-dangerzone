/*
    A messy attempt at getting a sprite attached to something like a game
    object. Contains code that displays a single Lost Soul (Doom monster) that
    can be controlled with the arrow keys, and exploded with the a key.
    
    Not much is currently in a "general" format (multiple sprite sheets/
    animations/animation format support) because I haven't gotten around
    to doing that yet. I wanted to actually get the damn thing running first.
    
    Fixed:
    - multiple animation support
    - runs after all images loaded
    - moved move method to inside the lost soul
*/

/*
    TODO:
    1. Change the keysDown thingy to an object and make it prettier
*/

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var keysDown = {};

var intervalId;
var timerDelay = 75;
var quit = false;
var game_time = 0;

var upCode = 38;
var downCode = 40;
var leftCode = 37;
var rightCode = 39;
var aCode = 65;

var images_loaded = 0;
var total_images = 1;

var lostSoul1 = new lost_soul();
lostSoul1.load();

function almost_equal(n1, n2) {
    if (Math.abs(n1 - n2) < 0.0001) {
        return true;
    } else {
        return false;
    }
}

// Let's assume there are 8 directions for a sprite at maximum:
// N, S, E, W, NE, NW, SE, SW
// The numbers here represent those somehow. I forget which ones are which.
function get_facing(heading, old_facing) {
    var h0_0 = almost_equal(heading[0], 0);
    var h1_0 = almost_equal(heading[1], 0);
    var h0_p = (heading[0] > 0);
    var h1_p = (heading[1] > 0);
    if (h0_0 && h1_0) {
        return old_facing;
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

// sx: array of starting x points
// ex: array of ending x points
// You can guess what sy, ey are...
function sprite_data(SX, SY, EX, EY) {
    this.sx = SX;
    this.sy = SY;
    this.ex = EX;
    this.ey = EY;
}

function lost_soul() {
    this.sprite_sheet = undefined;
    this.sheet_name = "Doom-LostSoul.png";
    // Orientation: S, SE, E, NE, N

    this.load = function() {
        var this_ls = this;
        var sheet = new Image();
        sheet.src = this.sheet_name;
        sheet.onload = function() {
            this_ls.sprite_sheet = sheet;
            images_loaded++;
            if (images_loaded === total_images) {
                run();
            }
        }
    }
    
    // Base sprite to display w/no animations
    this.base = new sprite_data([], [], [], []);
    this.base.sx = [8, 63, 102, 140, 182];
    this.base.sy = [6, 6, 6, 6, 6];
    this.base.ex = [57, 102, 140, 182, 234];
    this.base.ey = [63, 63, 63, 63, 63];
    
    // Animation list, animation 1 corresponds to elt 0
    this.animations = [new sprite_data([], [], [], [])];
    this.animations[0].sx = [10, 77, 140, 195, 271, 371];
    this.animations[0].sy = [293, 293, 299, 290, 292, 277];
    this.animations[0].ex = [50, 116, 190, 266, 364, 476];
    this.animations[0].ey = [350, 350, 350, 353, 365, 372];
    
    this.heading = [0, 0];
    this.position = [200, 200];
    this.step = 10;
    this.facing = 0;
    
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
            var current_animation = this.animations[this.animation - 1];
            var animation_delay = 2;
            var animation_frames = current_animation.sx.length;
            var elapsed_time = game_time - this.animation_start_time;
            if (elapsed_time === animation_delay * animation_frames) {
                this.animation = 0;
            }
            // - 1 to give the first and last iter enough repetitions
            iter = Math.floor((elapsed_time - 1) / animation_delay);
            sx = current_animation.sx[iter];
            sy = current_animation.sy[iter];
            ex = current_animation.ex[iter];
            ey = current_animation.ey[iter];
        } else {
            this.facing = get_facing(this.heading, this.facing);
            var facing_temp = this.facing;
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
            sx = this.base.sx[facing_temp];
            sy = this.base.sy[facing_temp];
            ex = this.base.ex[facing_temp];
            ey = this.base.ey[facing_temp];
        }
        var size_x = ex - sx;
        var size_y = ey - sy;
        if (flip) {
            x = 400 - x;
        }
        var dx = x - Math.floor(size_x / 2);
        var dy = y - Math.floor(size_y / 2);
        ctx.drawImage(this.sprite_sheet, sx, sy, size_x, size_y, dx, dy, 
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
    if (keysDown[upCode]) {
        h[1] -= 1;
    } 
    if (keysDown[downCode]) {
        h[1] += 1;
    }
    if (keysDown[leftCode]) {
        h[0] -= 1;
    }
    if (keysDown[rightCode]) {
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
        ctx.fillStyle = "rgba(128,128,128,0.75)";
        ctx.fillRect(0, 0, 400, 400);
        quit = true;
    } else if ((curr_code === upCode) && (keysDown[upCode] === undefined)) {
        keysDown[upCode] = true;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === downCode) && (keysDown[downCode] === undefined)) {
        keysDown[downCode] = true;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === leftCode) && (keysDown[leftCode] === undefined)) {
        keysDown[leftCode] = true;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === rightCode) && (keysDown[rightCode] === undefined)) {
        keysDown[rightCode] = true;
        lostSoul1.heading = compute_heading();
    } else if (curr_code === aCode) {
        lostSoul1.start_animation(1);
    }
}

function onKeyUp(event) {
    if (quit) return;
    var curr_code = event.keyCode;
    if ((curr_code === upCode) && (keysDown[upCode] === true)) {
        keysDown[upCode] = undefined;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === downCode) && (keysDown[downCode] === true)) {
        keysDown[downCode] = undefined;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === leftCode) && (keysDown[leftCode] === true)) {
        keysDown[leftCode] = undefined;
        lostSoul1.heading = compute_heading();
    } else if ((curr_code === rightCode) && (keysDown[rightCode] === true)) {
        keysDown[rightCode] = undefined;
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
