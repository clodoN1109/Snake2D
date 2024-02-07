#!/usr/bin/env node

import Game from './src/Game.js'
import UserInterface from './src/UserInterface.js'

const game = new Game(new UserInterface())

// Begin game
game.start()
