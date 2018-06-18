var ctx;
var WIDTH;
var HEIGHT;

function load() {
      var canvas = document.getElementById("canvasthingy");
      canvas.addEventListener("click",clicked);
      canvas.addEventListener("mousemove",moved);
      canvas.addEventListener("mousedown",mouseDown);
      canvas.addEventListener("mouseup",mouseUp);
      canvas.addEventListener("keypress",keyPress);
      var WIDTH = parseFloat(window.getComputedStyle(canvas).width);
      var HEIGHT = parseFloat(window.getComputedStyle(canvas).height);
      ctx = canvas.getContext('2d');
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      draw();
}

function draw() {
      window.requestAnimationFrame(draw);
      ctx.clearRect(0,0,WIDTH,HEIGHT);
      ctx.strokeStyle="#FF0000";
      drawRoundRect(10,10,100,200,10);
}

// this draws rounded rectangles. Just for example.
function drawRoundRect(x, y, width, height, radius, fill, stroke) {
      if (typeof stroke == "undefined" ) {
            stroke = true;
      }
      if (typeof radius === "undefined") {
            radius = 5;
      }
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      if (stroke) {
            ctx.stroke();
      }
      if (fill) {
            ctx.fill();
      }
}

// These are all callbacks for reacting to mouse events and key presses and stuff.
function clicked(click) {
      
}

function moved(move) {
      
}

function mouseDown(click) {
      
}
function mouseUp(click) {
      
}
function keyPress(key) {
      
}