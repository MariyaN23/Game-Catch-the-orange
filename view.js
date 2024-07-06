export class GameComponent {
    #tableElement
    #scoreElement
    #game
    constructor(game) {
        this.#tableElement = document.getElementById("game-grid")
        this.#scoreElement = document.getElementById("result")
        this.#game = game
        game.eventEmitter.on('change', ()=> {
            this.render()
        })
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
                    img.src = 'assets/img/orange.jpg'
                    td.append(img)
                }
                tr.append(td)
            }
            this.#tableElement.append(tr)
        }
    }
}