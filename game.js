class Game {
    #settings = {
        gridSize: {
            columnCount: 4,
            rowsCount: 4
        },
        googleJumpInterval: 2000,
    }
    #status = 'pending'
    #player1
    #player2
    #google

    constructor() {
    }
    #getRandomPosition(notCrossedPositions = []) {
        let newX
        let newY
        do {
            newX = NumberUtil.getRandomNumber(0, this.#settings.gridSize.columnCount - 1)
            newY = NumberUtil.getRandomNumber(0, this.#settings.gridSize.rowsCount - 1)
        } while (
            notCrossedPositions.some(p => newX === p.x && newY === p.y))
        return new Position(newX, newY)
    }
    set settings(settings) {
        if (!settings.gridSize) {
            throw new Error('Incorrect setting object')
        }
        if (settings.gridSize.columnCount * settings.gridSize.rowsCount < 3) {
            throw new Error('Cells count should be 3 and more. Increase columnCount or rowsCount.')
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
    get google() {
        return this.#google
    }
    #createPlayers() {
        const player1Position = new Position(NumberUtil.getRandomNumber(0, this.#settings.gridSize.columnCount - 1),
            NumberUtil.getRandomNumber(0, this.#settings.gridSize.rowsCount - 1))
        this.#player1 = new Player(player1Position)
        const player2Position = this.#getRandomPosition([player1Position])
        this.#player2 = new Player(player2Position)
        const googlePosition = this.#getRandomPosition([player1Position, player2Position])
        this.#google = new Google(googlePosition)
    }
    async start() {
        if (this.#status === 'pending') {
            this.#createPlayers()
            this.#status = 'in-progress'

            setInterval(()=> {
                const newGooglePosition = this.#getRandomPosition([this.#player1.position, this.#player2.position, this.#google.position])
                this.#google.position = newGooglePosition
            }, this.#settings.googleJumpInterval)
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
    clone() {
        return new Position(this.x, this.y)
    }
    equal(otherPosition) {
        return otherPosition.x === this.x && otherPosition.y === this.y
    }
}

class Unit {
    constructor(position) {
        this.position = position
    }
}

class Player extends Unit {
    constructor(position) {
        super(position)
    }
}

class Google extends Unit {
    constructor(position) {
        super(position)
    }
}

module.exports = {
    Game
}