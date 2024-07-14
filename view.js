import {directions} from './game.js';


export class GameComponent {
    #tableElement
    #scoreElement
    #game
    #controller
    #unbindEventListeners = null
    constructor(controller, game) {
        this.#tableElement = document.getElementById("game-grid")
        this.#scoreElement = document.getElementById("result")
        this.#game = game
        this.#controller = controller
        game.eventEmitter.on('change', ()=> {
            this.render()
        })
    }
    #bindEventListeners() {
        if (this.#unbindEventListeners !== null) {
            this.#unbindEventListeners()
        }
        const handlers = {
            "ArrowUp": ()=> this.#controller.movePlayer(directions.Up, 1),
            "ArrowDown": ()=> this.#controller.movePlayer(directions.Down, 1),
            "ArrowLeft": ()=> this.#controller.movePlayer(directions.Left, 1),
            "ArrowRight": ()=> this.#controller.movePlayer(directions.Right, 1),
            "KeyW": ()=> this.#controller.movePlayer(directions.Up, 2),
            "KeyS": ()=> this.#controller.movePlayer(directions.Down, 2),
            "KeyA": ()=> this.#controller.movePlayer(directions.Left, 2),
            "KeyD": ()=> this.#controller.movePlayer(directions.Right, 2)
        }
        const bindPlayerControls = (e) => {
            const handler = handlers[e.code]
            if (handler) {
                handler()
            }
        }

        window.addEventListener("keydown", bindPlayerControls)

        this.#unbindEventListeners = () => {
            window.removeEventListener("keydown", bindPlayerControls)
        }
    }
    render() {
        this.#tableElement.innerHTML = ''
        this.#scoreElement.innerHTML = ''
        this.#scoreElement.append(`Player 1: ${this.#game.score[1].points}, Player 2: ${this.#game.score[2].points}`)
        for (let y = 0; y < this.#game.settings.gridSize.rowsCount; y++) {
            const tr = document.createElement("tr")
            for (let x = 0; x < this.#game.settings.gridSize.columnCount; x++) {
                const td = document.createElement("td")
                if (this.#game.players[0].position.x === x && this.#game.players[0].position.y === y) {
                    const img = document.createElement("img")
                    img.src = 'assets/img/player1.png'
                    td.append(img)
                }
                if (this.#game.players[1].position.x === x && this.#game.players[1].position.y === y) {
                    const img = document.createElement("img")
                    img.src = 'assets/img/player2.png'
                    td.append(img)
                }
                if (this.#game.google.position.x === x && this.#game.google.position.y === y) {
                    const img = document.createElement("img")
                    img.src = 'assets/img/orange.png'
                    td.append(img)
                }
                tr.append(td)
            }
            this.#tableElement.append(tr)
        }
        if (this.#game.status === 'finished') {
            this.#tableElement.remove()
            this.#scoreElement.remove()

            const EndElement = document.getElementById("end")
            EndElement.textContent = `Player ${this.#game.winner} Win`
        }
        this.#bindEventListeners()
    }
}