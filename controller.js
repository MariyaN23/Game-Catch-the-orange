import {directions} from './game.js';

export class Controller {
    #game
    #wsAdapter
    constructor(game, wsAdapter) {
        this.#game = game
        this.#wsAdapter = wsAdapter

        this.#wsAdapter.subscribe('new-message', (event)=> {
            if (event.type === "GOOGLE/JUMPED") {
                this.#game.setGooglePosition(event.payload.x, event.payload.y)
            }
            if (event.type === "PLAYER/MOVED") {
                this.#reallyMovePlayer(event.payload.direction, event.payload.playerNumber)
            }
            if (event.type === "PLAYER/SET-START-POSITION") {
                this.#game.setPlayerPosition(event.payload.x, event.payload.y, event.payload.playerNumber)
            }
        })
    }
    movePlayer(direction, playerNumber) {
        this.#wsAdapter.send({
            commandType: "Move-Player",
            payload: {direction, playerNumber}
        })
    }
    #reallyMovePlayer(direction, playerNumber) {
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