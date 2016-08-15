var canvas = document.getElementById("sneic");
var ctx = canvas.getContext("2d");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function size(width, height) {
  this.width = width;
  this.height = height;
}

var bigPixel = new size(40, 40);
var menuPixel = new size(Math.floor(canvas.width / 24), Math.floor(canvas.height / 16)); // el menú es de 24x16 bloques

var gridXSize = Math.floor(canvas.width / bigPixel.width);
var gridYSize = Math.floor(canvas.height / bigPixel.height);

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

  this.add = function(pos) {
    return new coordPair(this.x + pos.x, this.y + pos.y);
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
    default: // "right"
      return new coordPair(pos.x + 1, pos.y);
  }
}

var draw = {
  backgroundColor: "#222222",
  menuTitle: [
    // S
    new coordPair(5, 2),
    new coordPair(4, 2),
    new coordPair(3, 3),
    new coordPair(3, 4),
    new coordPair(4, 4),
    new coordPair(5, 5),
    new coordPair(4, 6),
    new coordPair(3, 6),

    // N
    new coordPair(7, 6),
    new coordPair(7, 5),
    new coordPair(7, 4),
    new coordPair(7, 3),
    new coordPair(7, 2),
    new coordPair(8, 3),
    new coordPair(9, 4),
    new coordPair(10, 6),
    new coordPair(10, 5),
    new coordPair(10, 4),
    new coordPair(10, 3),
    new coordPair(10, 2),

    // E
    new coordPair(14, 2),
    new coordPair(13, 2),
    new coordPair(12, 2),
    new coordPair(12, 3),
    new coordPair(12, 4),
    new coordPair(13, 4),
    new coordPair(12, 5),
    new coordPair(12, 6),
    new coordPair(13, 6),
    new coordPair(14, 6),

    // I
    new coordPair(16, 2),
    new coordPair(16, 3),
    new coordPair(16, 4),
    new coordPair(16, 5),
    new coordPair(16, 6),

    // C
    new coordPair(20, 2),
    new coordPair(19, 2),
    new coordPair(18, 3),
    new coordPair(18, 4),
    new coordPair(18, 5),
    new coordPair(19, 6),
    new coordPair(20, 6)
  ],
  menuPlayButton: [
    // botón play
    new coordPair(10, 9),
    new coordPair(10, 10),
    new coordPair(10, 11),
    new coordPair(10, 12),
    new coordPair(10, 13),
    new coordPair(11, 13),
    new coordPair(12, 12),
    new coordPair(13, 12),
    new coordPair(14, 11),
    new coordPair(13, 10),
    new coordPair(12, 10),
    new coordPair(11, 9)
  ],

  clear: function() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.backgroundColor;
    ctx.fill();
    ctx.closePath();
  },

  rectangleWithSizeAt: function(pos, color, size) {
    ctx.beginPath();
    ctx.rect(pos.x * size.width, pos.y * size.height, size.width, size.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  },

  rectangleAt: function(pos, color) {
    this.rectangleWithSizeAt(pos, color, bigPixel);
  },

  menuScreen: function() {
    this.clear();

    for (i = 0; i < this.menuTitle.length; i++) {
      this.rectangleWithSizeAt(this.menuTitle[i], "#CCCCCC", menuPixel);
    }
    for (i = 0; i < this.menuPlayButton.length; i++) {
      this.rectangleWithSizeAt(this.menuPlayButton[i], "#CCCCCC", menuPixel);
    }
  },

  endGameScreen: function() { // TODO que muestre lo mismo que menuScreen incluyendo el puntaje
    for (i = 0; i < this.menuTitle.length; i++) {
      this.rectangleWithSizeAt(this.menuTitle[i], "#CCCCCC", menuPixel);
    }
    // TODO display score
    for (i = 0; i < this.menuPlayButton.length; i++) {
      this.rectangleWithSizeAt(this.menuPlayButton[i].add(new coordPair(6, 0)), "#CCCCCC", menuPixel);
    }
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
  }
};

var snake = {
  body: [], // contiene elementos coordPair, las posiciones del cuerpo del snake
  headIndex: undefined, // índice en body de la posición de la cabeza
  tailIndex: function() {
    return (this.headIndex + 1) % this.body.length;
  },
  currentDirection: undefined,
  nextDirection: undefined,

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
      this.pos.x = getRandomInt(0, gridXSize - 1);
      this.pos.y = getRandomInt(0, gridYSize - 1);
    } while (snake.hasBodyPartAt(this.pos));
  }
};

var game = { // TODO agregar puntaje. visualizarlo cuando se pierde.
  interval: undefined,

  menuScreen: function() {
    listeners.addMouseUp();
    draw.menuScreen();
  },

  endGameScreen: function() {
    clearInterval(game.interval);
    listeners.removeKeyDown();
    listeners.addMouseUp();
    draw.endGameScreen();
  },

  // inicializa todos los elementos
  initialize: function() {
    snake.body = [
      new coordPair(4, 6),
      new coordPair(2, 6),
      new coordPair(3, 6),
    ];
    snake.headIndex = 0;
    snake.currentDirection = "right";
    snake.nextDirection = "right";
    food.respawn();

    listeners.addKeyDown();
    draw.screen();
    this.interval = setInterval(game.drawNextState, 200);
  },

  nextState: function() {
    // TODO hacer los keydown mas certeros
    snake.currentDirection = snake.nextDirection;
    var nextHeadPos = getPosInDirection(snake.body[snake.headIndex], snake.currentDirection);

    if (snake.hasBodyPartAt(nextHeadPos) || gameArea.outOfBounds(nextHeadPos)) { // si choco contra si mismo o contra la pared
      return 0;
    } else {
      snake.moveHeadIndex();
      if (nextHeadPos.equals(food.pos)) { // si come
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
      game.endGameScreen();
    }
  }
};

var listeners = {
  addMouseUp: function() {
    document.addEventListener("mouseup", this.mouseUpHandler, false);
  },
  removeMouseUp: function() {
    document.removeEventListener("mouseup", this.mouseUpHandler, false);
  },
  mouseUpHandler: function(e) {
    if (e.button === 0) {
      game.initialize();
    }
    listeners.removeMouseUp();
  },

  addKeyDown: function() {
    document.addEventListener("keydown", this.keyDownHandler, false);
  },
  removeKeyDown: function() {
    document.removeEventListener("keydown", this.keyDownHandler, false);
  },
  keyDownHandler: function(e) {
    switch (e.key) {
      case "ArrowUp":
        snake.nextDirection = (snake.currentDirection === "down") ? snake.nextDirection : "up";
        break;
      case "ArrowDown":
        snake.nextDirection = (snake.currentDirection === "up") ? snake.nextDirection : "down";
        break;
      case "ArrowLeft":
        snake.nextDirection = (snake.currentDirection === "right") ? snake.nextDirection : "left";
        break;
      default: // "ArrowRight"
        snake.nextDirection = (snake.currentDirection === "left") ? snake.nextDirection : "right";
    }
  }
};

game.menuScreen();
