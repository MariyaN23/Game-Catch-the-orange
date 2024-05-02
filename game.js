class Game {
    #settings = {
        gridSize: {
            x: 4,
            y: 4
        }
    }
    #status = 'pending'
    #player1
    #player2

    constructor() {
    }
    #getRandomPosition() {
        let newX
        let newY
        do {
            newX = NumberUtil.getRandomNumber(0, this.#settings.gridSize.x)
            newY = NumberUtil.getRandomNumber(0, this.#settings.gridSize.y)
        } while (newX === this.#player1.x && newY === this.#player1.y)
        return new Position(newX, newY)
    }
    set settings(settings) {
        if (!settings.gridSize) {
            throw new Error('Incorrect setting object')
        }
        this.#settings = settings
    }
    get settings() {
        return this.#settings
    }
    get status() {
        return this.#status
    }
    get players() {
        return [this.#player1, this.#player2]
    }
    #createPlayers() {
        const player1Position = new Position(NumberUtil.getRandomNumber(0, this.#settings.gridSize.x),
            NumberUtil.getRandomNumber(0, this.#settings.gridSize.y))
        this.#player1 = new Player(player1Position)
        const player2Position = this.#getRandomPosition()
        this.#player2 = new Player(player2Position)
    }
    start() {
        if (this.#status === 'pending') {
            this.#createPlayers()
            this.#status = 'in-progress'
        }

    }
}

class NumberUtil {
    static getRandomNumber(min, max) {
        return Math.floor(Math.random()*(max - min + 1)) + min
    }
}

class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
class Player {
    constructor(position) {
        this.position = position
    }
}



module.exports = {
    Game
}