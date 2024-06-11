import {
  GAME_SPEED,
  DIRECTIONS,
  INITIAL_SNAKE_SIZE,
  SNAKE_COLOR,
  DOT_COLOR,
  DIRECTION_UP,
  DIRECTION_RIGHT,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  WALL_COLOR,
} from './constants.js'


/**
 * @class Game
 *
 * The Game class tracks the state of three things:
 *
 * 1. The snake, including its direction, velocity, and location
 * 2. The dot
 * 3. The score
 *
 * The i/o of the game is handled by a separate UserInterface class, which is
 * responsible for detecting all event handlers (key press), creating the
 * screen, and drawing elements to the screen.
 */
class Game {
  constructor(ui) {
    // User interface class for all i/o operations
    this.ui = ui

    this.reset()

    // Bind handlers to UI so we can detect input change from the Game class
    this.ui.Handlers(
      this.changeDirection.bind(this),
      this.quit.bind(this),
      this.start.bind(this),
      this.drawWalls.bind(this),
    )

  }

  reset() {
    // Set up initial state
    this.snake = []

    for (let i = INITIAL_SNAKE_SIZE; i >= 0; i--) {
      this.snake[INITIAL_SNAKE_SIZE - i] = { x: i, y: 3 }
    }

    this.dot = {}
    this.score = 0
    this.currentDirection = DIRECTION_RIGHT
    this.changingDirection = false
    this.timer = null

    // Generate the first dot before the game begins
    this.generateDot()
    this.ui.resetScore()
    this.ui.render()
  }

  /**
   * Support WASD and arrow key controls. Update the direction of the snake, and
   * do not allow reversal.
   */
  changeDirection(_, key) {
    if ((key.name === DIRECTION_UP || key.name === 'w') && this.currentDirection !== DIRECTION_DOWN) {
      this.currentDirection = DIRECTION_UP
    }
    if ((key.name === DIRECTION_DOWN || key.name === 's') && this.currentDirection !== DIRECTION_UP) {
      this.currentDirection = DIRECTION_DOWN
    }
    if ((key.name === DIRECTION_LEFT || key.name === 'a') && this.currentDirection !== DIRECTION_RIGHT) {
      this.currentDirection = DIRECTION_LEFT
    }
    if ((key.name === DIRECTION_RIGHT || key.name === 'd') && this.currentDirection !== DIRECTION_LEFT) {
      this.currentDirection = DIRECTION_RIGHT
    }
  }

  /**
   * Set the velocity of the snake based on the current direction. Create a new
   * head by adding a new segment to the beginning of the snake array,
   * increasing by one velocity. Remove one item from the end of the array to
   * make the snake move, unless the snake collides with a dot - then increase
   * the score and increase the length of the snake by one.
   *
   */
  moveSnake() {
    if (this.changingDirection) {
      return
    }
    this.changingDirection = true

    // Move the head forward by one pixel based on velocity
    const head = {
      x: this.snake[0].x + DIRECTIONS[this.currentDirection].x,
      y: this.snake[0].y + DIRECTIONS[this.currentDirection].y,
    }

    this.snake.unshift(head)

    // If the snake lands on a dot, increase the score and generate a new dot
    if (this.snake[0].x === this.dot.x && this.snake[0].y === this.dot.y) {
      this.score++
      this.ui.updateScore(this.score)
      this.generateDot()
    } else {
      // Otherwise, slither
      this.snake.pop()
    }
  }

  generateRandomPixelCoord(min, max) {
    // Get a random coordinate from 0 to max container height/width
    // The division and subsequent multiplication by 2 is inteded to guarantee 
    // rounding to the nearest even number.
    return 2 * Math.round((Math.random() * (max - min) + min) / 2)
  }

  generateDot() {
    // Generate a dot at a random x/y coordinate
    this.dot.x = this.generateRandomPixelCoord(1, this.ui.gameContainer.width - 3)
    this.dot.y = this.generateRandomPixelCoord(1, this.ui.gameContainer.height - 4)

    // If the pixel is on a snake, regenerate the dot
    this.snake.forEach(segment => {
      if (segment.x === this.dot.x && segment.y === this.dot.y) {
        this.generateDot()
      }
    })
  }

  drawWalls() {

    let Walls = function Walls(x_max, y_max) {
      
      let walls = []

      for (let y = 0; y <= 200; y++) {
        for (let x = 0; x <= 200; x++) {
          
          if ((y === 0) || (x === 0) || (x === x_max-2) || (y === y_max-1)) {
            walls.push({x:x, y:y});        
          }  
        
        }
      }
    
      return walls
    
    }(this.ui.gameContainer.width, this.ui.gameContainer.height)

    Walls.forEach(brick => {
      this.ui.draw(brick, WALL_COLOR)
    })
  }

  drawSnake() {
    // Render each snake segment as a pixel
    this.snake.forEach(segment => {
      this.ui.draw(segment, SNAKE_COLOR)
    })
  }

  drawDot() {
    // Render the dot as a pixel
    this.ui.draw(this.dot, DOT_COLOR)
  }

  isGameOver() {
    // If the snake collides with itself, end the game
    const collide = this.snake
      // Filter out the head
      .filter((_, i) => i > 0)
      // If head collides with any segment, collision
      .some(segment => segment.x === this.snake[0].x && segment.y === this.snake[0].y)

    return (
      collide ||
      // Right wall
      this.snake[0].x >= this.ui.gameContainer.width -2 ||
      // Left wall
      this.snake[0].x <= 0 ||
      // Top wall
      this.snake[0].y >= this.ui.gameContainer.height - 1 ||
      // Bottom wall
      this.snake[0].y <= 0
    )
  }

  showGameOverScreen() {
    this.ui.gameOverScreen()
    this.ui.render()
  }

  tick() {

    if (this.isGameOver()) {
      this.showGameOverScreen()
      clearInterval(this.timer)
      this.timer = null

      return
    }


    this.changingDirection = false
    this.ui.clearScreen()
    this.drawDot()
    this.moveSnake()
    this.drawSnake()
    this.drawWalls()
    this.ui.render()
  }

  start() {
    if (!this.timer) {
      this.reset()

      this.timer = setInterval(this.tick.bind(this), GAME_SPEED)
    }
  }

  quit() {
    process.exit(0)
  }
}

export default Game 
