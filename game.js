
var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX= 10;
var ballSpeedY = 4;
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 7;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
var showingWinScreen = false;


function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scroolLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}


function handleMouseclick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framePerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
    }, 1000/framePerSecond);

  canvas.addEventListener('mousemove',
    function(evt) {
      var mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    });

  canvas.addEventListener('mousedown', handleMouseclick);
};

function ballReset() {
  if (player1Score >= WINNING_SCORE ||
      player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}


function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if (paddle2YCenter < ballY-35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}


function moveEverything() {
  if(showingWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // checks to see if ball misses paddle on right side, reset ball to center
  if (ballX > canvas.width) {
    if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
            //line 73-74 are how you can change ball speed based on how the ball hits the paddle same on like 83-84
            var deltaY = ballY -(paddle2Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY* 0.35;
    } else {
      player1Score ++; //must be BEFORE ballReset()
      ballReset();
    }
  }
  // checks to see if ball misses paddle on left side, reset ball to center
  if (ballX < 0) {
    if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY -(paddle1Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY* 0.35;
    } else {
      player2Score ++; //must be BEFORE ballReset()
      ballReset();
    }
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}


function drawNet() {
  for(var i=0; i<canvas.height; i +=40) {
    colorRect(canvas.width/2-1,i,2,20,'green');
  }
}


function drawEverything() {
  // next line blanks out the screen with black
  colorRect(0,0,canvas.width,canvas.height,"black");

  if (showingWinScreen) {
    canvasContext.fillStyle = 'green';

    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText('Left Player won!',350,200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText('Right Player won!',350,200);
    }
    canvasContext.fillText('click to continue', 350, 500);
    return;
  }

  drawNet();


  // this line is left player paddle
  colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'green');

  // this line is right computer paddle
  colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'green');

  // this line is the ball
  colorCircle(ballX, ballY, 10,'white');

  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width-100,100);

}


function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle= drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY,radius,0,Math.PI*2,true);
  canvasContext.fill();
}

function colorRect(leftX,topY,width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX,topY,width,height);
}




















