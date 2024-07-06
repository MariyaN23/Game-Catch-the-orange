import {Game} from './game.js';

const game = new Game()
const startGame = async () => {
    await game.start()
    const tableElement = document.getElementById("game-grid")
    const render = () => {
        tableElement.innerHTML = ''
        for (let y = 0; y < game.settings.gridSize.rowsCount; y++) {
            const tr = document.createElement("tr")
            for (let x = 0; x < game.settings.gridSize.columnCount; x++) {
                const td = document.createElement("td")
                if (game.players[0].position.x === x && game.players[0].position.y === y) {
                    const img = document.createElement("img")
                    img.src = 'assets/img/player1.png'
                    td.append(img)
                }
                if (game.players[1].position.x === x && game.players[1].position.y === y) {
                    const img = document.createElement("img")
                    img.src = 'assets/img/player2.png'
                    td.append(img)
                }
                if (game.google.position.x === x && game.google.position.y === y) {
                    const img = document.createElement("img")
                    img.src = 'assets/img/orange.jpg'
                    td.append(img)
                }
                tr.append(td)
            }
            tableElement.append(tr)
        }
    }
    render()
}

startGame()
