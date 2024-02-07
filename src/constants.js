const GAME_SPEED = 50
  // Horizontal speed has a greater value than vertical speed in response to the rectangular ratio between vertical and 
  // horizontal screen resolutions.
const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  right: { x: 2, y: 0 },
  left: { x: -2, y: 0 },
}
const INITIAL_SNAKE_SIZE = 10
const SNAKE_COLOR = 'green'
const DOT_COLOR = 'red'

const DIRECTION_UP = 'up';
const DIRECTION_RIGHT = 'right';
const DIRECTION_DOWN = 'down';
const DIRECTION_LEFT = 'left';

export {
  GAME_SPEED,
  DIRECTIONS,
  INITIAL_SNAKE_SIZE,
  SNAKE_COLOR,
  DOT_COLOR,
  DIRECTION_UP,
  DIRECTION_RIGHT,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
}
