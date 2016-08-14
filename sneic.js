var canvas = document.getElementById("sneic");
var ctx = canvas.getContext("2d");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var bigPixelSize = {  // TODO aumentar bigPixelSize a 40x40. adaptar draw.mainMenu
  width: 20,
  height: 20
};
var gridXSize = canvas.width / bigPixelSize.width;
var gridYSize = canvas.height / bigPixelSize.height;

var gameArea = {
  outOfBounds: function(pos) {
    return (pos.x < 0 || pos.y < 0 || pos.x > gridXSize - 1 || pos.y > gridYSize - 1);
  }
};

function coordPair(x, y) {
  this.x = x;
  this.y = y;

  this.equals = function(pos) {
    return (this.x === pos.x) && (this.y === pos.y);
  };
}

function getPosInDirection(pos, direction) {
  switch (direction) {
    case "up":
      return new coordPair(pos.x, pos.y - 1);
    case "down":
      return new coordPair(pos.x, pos.y + 1);
    case "left":
      return new coordPair(pos.x - 1, pos.y);
    default:  // "right"
      return new coordPair(pos.x + 1, pos.y);
  }
}

var draw = {
  backgroundColor: "#222222",
  mainMenu: [
    // S
    new coordPair(5,2),
    new coordPair(4,2),
    new coordPair(3,3),
    new coordPair(3,4),
    new coordPair(4,4),
    new coordPair(5,5),
    new coordPair(4,6),
    new coordPair(3,6),

    // N
    new coordPair(7,6),
    new coordPair(7,5),
    new coordPair(7,4),
    new coordPair(7,3),
    new coordPair(7,2),
    new coordPair(8,3),
    new coordPair(9,4),
    new coordPair(10,6),
    new coordPair(10,5),
    new coordPair(10,4),
    new coordPair(10,3),
    new coordPair(10,2),

    // E
    new coordPair(14,2),
    new coordPair(13,2),
    new coordPair(12,2),
    new coordPair(12,3),
    new coordPair(12,4),
    new coordPair(13,4),
    new coordPair(12,5),
    new coordPair(12,6),
    new coordPair(13,6),
    new coordPair(14,6),

    // I
    new coordPair(16,2),
    new coordPair(16,3),
    new coordPair(16,4),
    new coordPair(16,5),
    new coordPair(16,6),

    // C
    new coordPair(20,2),
    new coordPair(19,2),
    new coordPair(18,3),
    new coordPair(18,4),
    new coordPair(18,5),
    new coordPair(19,6),
    new coordPair(20,6),

    // botón play
    new coordPair(10,9),
    new coordPair(10,10),
    new coordPair(10,11),
    new coordPair(10,12),
    new coordPair(10,13),
    new coordPair(11,13),
    new coordPair(12,12),
    new coordPair(13,12),
    new coordPair(14,11),
    new coordPair(13,10),
    new coordPair(12,10),
    new coordPair(11,9)
  ],

  clear: function() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.backgroundColor;
    ctx.fill();
    ctx.closePath();
  },

  rectangleAt: function(pos, color) {
    ctx.beginPath();
    ctx.rect(pos.x * bigPixelSize.width, pos.y * bigPixelSize.height, bigPixelSize.width, bigPixelSize.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  },

  screen: function() {
    this.clear();

    // resto del cuerpo
    for (i = snake.headIndex + 1; i < snake.body.length + snake.headIndex; i++) {
      this.rectangleAt(snake.body[(i % snake.body.length)], "#AAAAAA");
    }

    // cabeza
    this.rectangleAt(snake.body[snake.headIndex], "#AA2222");

    // comida
    this.rectangleAt(food.pos, "#00AA00");
  },

  endGameScreen: function() {
    this.clear();

    for (i = 0; i < this.mainMenu.length; i++) {
      this.rectangleAt(this.mainMenu[i], "#CCCCCC");
    }
  }
};

var snake = {
  body: [], // contiene elementos coordPair, las posiciones del cuerpo del snake
  headIndex: undefined, // índice en body de la posición de la cabeza
  tailIndex: function() {
    return (this.headIndex + 1) % this.body.length;
  },
  direction: undefined,

  hasBodyPartAt: function(pos) { // calcula si hay una parte del cuerpo en pos
    var aux = false;
    var i = 0;
    while ((!aux) && (i < snake.body.length)) {
      aux = pos.equals(snake.body[i]);
      i++;
    }
    return aux;
  },

  moveHeadIndex: function() {
    this.headIndex = this.tailIndex();
  },

  insertInHeadIndex: function(pos) {
    this.body.splice(this.headIndex, 0, pos);
  },

  replaceHeadIndex: function(pos) {
    this.body[this.headIndex] = pos;
  }
};

var food = {
  pos: new coordPair(0, 0),

  respawn: function() {
    do { // busca una posicion para respawnear donde no haya cuerpo de snake
      this.pos.x = getRandomInt(0, gridXSize);
      this.pos.y = getRandomInt(0, gridYSize);
    } while (snake.hasBodyPartAt(this.pos));
  }
};

var game = {  // TODO agregar puntaje. visualizarlo cuando se pierde.
  interval: undefined,
  // inicializa todos los elementos
  initialize: function() {  // TODO hacer que el juego comience con la pantalla draw.mainMenu. y hacer click para empezar
    snake.body = [
      new coordPair(4, 12),
      new coordPair(2, 12),
      new coordPair(3, 12),
    ];
    snake.headIndex = 0;
    snake.direction = "right";
    food.respawn();

    draw.screen();
    this.interval = setInterval(game.drawNextState, 200);
  },

  nextState: function() {
    // TODO hacer que la serpiente no pueda ir en la dirección contraria, es decir, que no se pise
    // TODO hacer los keydown mas certeros
    var nextHeadPos = getPosInDirection(snake.body[snake.headIndex], snake.direction);

    if (snake.hasBodyPartAt(nextHeadPos) || gameArea.outOfBounds(nextHeadPos)) {  // si choco contra si mismo o contra la pared
      return 0;
    } else {
      snake.moveHeadIndex();
      if (nextHeadPos.equals(food.pos)) {  // si come
        snake.insertInHeadIndex(nextHeadPos);
        food.respawn();
      } else {
        snake.replaceHeadIndex(nextHeadPos);
      }
    }
    return 1;
  },

  drawNextState: function() {
    if (game.nextState() == 1) {
      draw.screen();
    } else {
      draw.endGameScreen();
      clearInterval(game.interval);
    }
  }
};

document.addEventListener("keydown", keyDownHandler, false);
function keyDownHandler(e) {
  switch (e.key) {
    case "ArrowUp":
      snake.direction = "up";
      break;
    case "ArrowDown":
      snake.direction = "down";
      break;
    case "ArrowLeft":
      snake.direction = "left";
      break;
    default:  // "ArrowRight"
      snake.direction = "right";
  }
}

game.initialize();
