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

var color = {
  background: "#77916A",
  backgroundTransparent: "rgba(255, 255, 255, 0.2)",
  menuLetter: "#2b3626",
  menuLetterEnd: "#2b3626",
  snakeHead: "#2b3626",
  snakeBody: "#2b3626",
  food: "#76535A"
};

var draw = {
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
    this.rectangleWithSizeAt(new coordPair(0, 0), new size(canvas.width, canvas.height), color.background);
  },

  rectangleWithSizeAt: function(pos, size, color) {
    ctx.beginPath();
    ctx.rect(pos.x * size.width, pos.y * size.height, size.width, size.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  },

  rectangleAt: function(pos, color) {
    this.rectangleWithSizeAt(pos, bigPixel, color);
  },

  menuScreen: function() {
    this.clear();

    for (i = 0; i < this.menuTitle.length; i++) {
      this.rectangleWithSizeAt(this.menuTitle[i], menuPixel, color.menuLetter);
    }
    for (i = 0; i < this.menuPlayButton.length; i++) {
      this.rectangleWithSizeAt(this.menuPlayButton[i], menuPixel, color.menuLetter);
    }
  },

  digit: function(dig) { // devuelve arreglo de pixeles del dígito dig. devuelve false si dig no es un dígito
    switch (dig) {
      case "0":
        return [
          new coordPair(0, 0),
          new coordPair(1, 0),
          new coordPair(2, 0),
          new coordPair(2, 1),
          new coordPair(2, 2),
          new coordPair(2, 3),
          new coordPair(2, 4),
          new coordPair(1, 4),
          new coordPair(0, 4),
          new coordPair(0, 3),
          new coordPair(0, 2),
          new coordPair(0, 1)
        ];
      case "1":
        return [
          new coordPair(2, 0),
          new coordPair(2, 1),
          new coordPair(2, 2),
          new coordPair(2, 3),
          new coordPair(2, 4)
        ];
      case "2":
        return [
          new coordPair(0, 0),
          new coordPair(1, 0),
          new coordPair(2, 0),
          new coordPair(2, 1),
          new coordPair(2, 2),
          new coordPair(1, 2),
          new coordPair(0, 2),
          new coordPair(0, 3),
          new coordPair(0, 4),
          new coordPair(1, 4),
          new coordPair(2, 4)
        ];
      case "3":
        return [
          new coordPair(0, 0),
          new coordPair(1, 0),
          new coordPair(2, 0),
          new coordPair(2, 1),
          new coordPair(2, 2),
          new coordPair(1, 2),
          new coordPair(2, 3),
          new coordPair(2, 4),
          new coordPair(1, 4),
          new coordPair(0, 4)
        ];
      case "4":
        return [
          new coordPair(0, 0),
          new coordPair(0, 1),
          new coordPair(0, 2),
          new coordPair(1, 2),
          new coordPair(2, 0),
          new coordPair(2, 1),
          new coordPair(2, 2),
          new coordPair(2, 3),
          new coordPair(2, 4)
        ];
      case "5":
        return [
          new coordPair(2, 0),
          new coordPair(1, 0),
          new coordPair(0, 0),
          new coordPair(0, 1),
          new coordPair(0, 2),
          new coordPair(1, 2),
          new coordPair(2, 2),
          new coordPair(2, 3),
          new coordPair(2, 4),
          new coordPair(1, 4),
          new coordPair(0, 4)
        ];
      case "6":
        return [
          new coordPair(2, 0),
          new coordPair(1, 0),
          new coordPair(0, 0),
          new coordPair(0, 1),
          new coordPair(0, 2),
          new coordPair(0, 3),
          new coordPair(0, 4),
          new coordPair(1, 4),
          new coordPair(2, 4),
          new coordPair(2, 3),
          new coordPair(2, 2),
          new coordPair(1, 2)
        ];
      case "7":
        return [
          new coordPair(0, 0),
          new coordPair(1, 0),
          new coordPair(2, 0),
          new coordPair(2, 1),
          new coordPair(2, 2),
          new coordPair(1, 2),
          new coordPair(2, 3),
          new coordPair(2, 4)
        ];
      case "8":
        return [
          new coordPair(0, 0),
          new coordPair(1, 0),
          new coordPair(2, 0),
          new coordPair(2, 1),
          new coordPair(2, 2),
          new coordPair(2, 3),
          new coordPair(2, 4),
          new coordPair(1, 4),
          new coordPair(0, 4),
          new coordPair(0, 3),
          new coordPair(0, 2),
          new coordPair(0, 1),
          new coordPair(1, 2)
        ];
      case "9":
        return [
          new coordPair(1, 0),
          new coordPair(0, 0),
          new coordPair(0, 1),
          new coordPair(0, 2),
          new coordPair(1, 2),
          new coordPair(2, 0),
          new coordPair(2, 1),
          new coordPair(2, 2),
          new coordPair(2, 3),
          new coordPair(2, 4)
        ];
      default:
        return false;
    }
  },

  number: function(num) { // descompone num en digitos y los imprime
    var numString = num.toString();
    if (numString.length < 3) {
      var aux = "000" + numString;
      numString = aux.substr(aux.length - 3);
    }

    for (var i = 0; i < numString.length; i++) {
      var digitPixels = this.digit(numString[i]);
      for (var j = 0; j < digitPixels.length; j++) {
        this.rectangleWithSizeAt(digitPixels[j].add(new coordPair(11 - 4 * (numString.length - i - 1), 9)), menuPixel, color.menuLetterEnd);
      }
    }
  },

  endGameScreen: function() {
    this.rectangleWithSizeAt(new coordPair(0, 0), new size(canvas.width, canvas.height), color.backgroundTransparent);

    for (i = 0; i < this.menuTitle.length; i++) {
      this.rectangleWithSizeAt(this.menuTitle[i], menuPixel, color.menuLetterEnd);
    }

    for (i = 0; i < this.menuPlayButton.length; i++) {
      this.rectangleWithSizeAt(this.menuPlayButton[i].add(new coordPair(6, 0)), menuPixel, color.menuLetterEnd);
    }

    this.number(snake.body.length);
  },

  screen: function() {
    this.clear();

    // resto del cuerpo
    for (i = snake.headIndex + 1; i < snake.body.length + snake.headIndex; i++) {
      this.rectangleAt(snake.body[(i % snake.body.length)], color.snakeBody);
    }

    // cabeza
    this.rectangleAt(snake.body[snake.headIndex], color.snakeHead);

    // comida
    this.rectangleAt(food.pos, color.food);
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

var game = {
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
      case "ArrowRight":
        snake.nextDirection = (snake.currentDirection === "left") ? snake.nextDirection : "right";
    }
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
  addMouseUp: function() {
    document.addEventListener("mouseup", this.mouseUpHandler, false);
  },
  removeMouseUp: function() {
    document.removeEventListener("mouseup", this.mouseUpHandler, false);
  },
};

game.menuScreen();
