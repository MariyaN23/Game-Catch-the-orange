import {Game} from './game.js';
import {EventEmitter} from './utils/observer/eventEmitter.js';
import {GameComponent} from './view.js';

const startGame = async () => {
    const eventEmitter = new EventEmitter()
    const game = new Game("new game", eventEmitter)
    await game.start()
    const view = new GameComponent(game)
    view.render()

    window.addEventListener("keydown", (e)=> {
        switch (e.code) {
            case "ArrowUp":
                game.movePlayer1ToUp()
                break
            case "ArrowDown":
                game.movePlayer1ToDown()
                break
            case "ArrowLeft":
                game.movePlayer1ToLeft()
                break
            case "ArrowRight":
                game.movePlayer1ToRight()
                break
        }
    })

    window.addEventListener("keydown", (e)=> {
        switch (e.code) {
            case "KeyW":
                game.movePlayer2ToUp()
                break
            case "KeyS":
                game.movePlayer2ToDown()
                break
            case "KeyA":
                game.movePlayer2ToLeft()
                break
            case "KeyD":
                game.movePlayer2ToRight()
                break
        }
    })
}

startGame()
