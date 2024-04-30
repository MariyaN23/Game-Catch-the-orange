class Game {
    #settings
    #status = 'pending'
    #player1
    #player2

    constructor() {
        this.#player1 = new Player(NumberUtil.getRandomNumber(0, this.#settings.gridSize.x),
            NumberUtil.getRandomNumber(0, this.#settings.gridSize.y))
        const randomPositionForPlayer2 = getRandomPosition()
        this.#player2 = new Player(randomPositionForPlayer2.x, randomPositionForPlayer2.y)
    }
    #getRandomPosition() {
        let newX
        let newY
        do {
            newX = NumberUtil.getRandomNumber(0, this.#settings.gridSize.x)
            newY = NumberUtil.getRandomNumber(0, this.#settings.gridSize.y)
        } while (newX === this.#player1.x && newY === this.#player1.y)
        return {x: newX, y: newY}
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
    start() {
        if (this.#status === 'pending') {
            this.#status = 'in-progress'
        }

    }
}

class Player {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class NumberUtil {
    static getRandomNumber(min, max) {
        return Math.floor(Math.random()*(max - min + 1)) + min
    }
}

module.exports = {
    Game
}