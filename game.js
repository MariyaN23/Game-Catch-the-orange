class Game {
    #settings = {
        gridSize: {
            columnCount: 4,
            rowsCount: 4
        },
        googleJumpInterval: 2000,
        pointsToWin: 10,
    }
    #status = 'pending'
    #score = {
        1: {points: 0},
        2: {points: 0}
    }
    #player1
    #player2
    #google
    #googleJumpInterval

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
        this.#settings = {
            ...this.#settings,
            ...settings
        }
        this.#settings.gridSize = settings.gridSize ? {
            ...this.#settings.gridSize,
            ...settings.gridSize
        } : this.#settings.gridSize
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
    get score() {
        return this.#score
    }
    #movePlayer(player, otherPlayer, delta) {
        const canMove = this.#canMoveOrOutOfBorders(player, delta)
        if (!canMove) return
        const canMoveOrOtherPlayer = this.#canMoveOrOtherPlayerBlocking(player, otherPlayer, delta)
        if (!canMoveOrOtherPlayer) return;
        if (delta.x) player.position.x += delta.x
        if (delta.y) player.position.y += delta.y
        this.#checkGoogleCatching(player)
    }
    #canMoveOrOutOfBorders(player, delta) {
        const newPosition = player.position.clone()
        if (delta.x) {
            newPosition.x += delta.x
        }
        if (delta.y) {
            newPosition.y += delta.y
        }
        if (newPosition.x < 0 || newPosition.x > this.#settings.gridSize.columnCount) return false
        if (newPosition.y < 0 || newPosition.y > this.#settings.gridSize.rowsCount) return false
        return true
    }
    #canMoveOrOtherPlayerBlocking(movingPlayer, otherPlayer, delta) {
        const newPosition = movingPlayer.position.clone()
        if (delta.x) {
            newPosition.x += delta.x
        }
        if (delta.y) {
            newPosition.y += delta.y
        }
        return !otherPlayer.position.equal(newPosition)
    }
    #checkGoogleCatching(player) {
        if (player.position.equal(this.#google.position)) {
            this.#score[player.number].points++
            if (this.#score[player.number].points === this.#settings.pointsToWin) {
                this.#finishGame()
            } else {
                this.#moveGoogleToRandomPosition()
            }
        }
    }
    movePlayer1ToRight() {
        const delta = {x: 1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }
    movePlayer1ToLeft() {
        const delta = {x: -1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }
    movePlayer1ToUp() {
        const delta = {y: -1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }
    movePlayer1ToDown() {
        const delta = {y: 1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }
    movePlayer2ToRight() {
        const delta = {x: 1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }
    movePlayer2ToLeft() {
        const delta = {x: -1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }
    movePlayer2ToUp() {
        const delta = {y: -1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }
    movePlayer2ToDown() {
        const delta = {y: 1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }
    #createPlayers() {
        const player1Position = new Position(NumberUtil.getRandomNumber(0, this.#settings.gridSize.columnCount - 1),
            NumberUtil.getRandomNumber(0, this.#settings.gridSize.rowsCount - 1))
        this.#player1 = new Player(player1Position, 1)
        const player2Position = this.#getRandomPosition([player1Position])
        this.#player2 = new Player(player2Position, 2)

        this.#google = new Google()
        this.#moveGoogleToRandomPosition(true)
    }
    async start() {
        if (this.#status === 'pending') {
            this.#createPlayers()
            this.#status = 'in-progress'

            this.#googleJumpInterval = setInterval(()=> {
                this.#moveGoogleToRandomPosition()
            }, this.#settings.googleJumpInterval)
        }

    }
    async stop() {
        this.#status = 'stopped'
        clearInterval(this.#googleJumpInterval)
    }
    #moveGoogleToRandomPosition(excludeGoogle = false) {
        let notCrossedPosition = [
            this.#player1.position,
            this.#player2.position
        ]
        if (!excludeGoogle) {
            notCrossedPosition.push(this.#google.position)
        }
        const newGooglePosition = this.#getRandomPosition(notCrossedPosition)
        this.#google.position = newGooglePosition
    }
    #finishGame() {
        this.#status = 'finished'
        clearInterval(this.#googleJumpInterval)
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
    constructor(position, number) {
        super(position)
        this.number = number
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