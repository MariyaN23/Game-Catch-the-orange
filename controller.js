import {directions} from './game.js';

export class Controller {
    #game
    constructor(game) {
        this.#game = game
    }
    movePlayer(direction, playerNumber) {
        switch (direction) {
            case directions.Up:
                this.#game[`movePlayer${playerNumber}ToUp`]()
                break
            case directions.Down:
                this.#game[`movePlayer${playerNumber}ToDown`]()
                break
            case directions.Left:
                this.#game[`movePlayer${playerNumber}ToLeft`]()
                break
            case directions.Right:
                this.#game[`movePlayer${playerNumber}ToRight`]()
                break
        }
    }
}