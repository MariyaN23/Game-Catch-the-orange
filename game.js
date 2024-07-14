export const directions = {
    Up: 'Up',
    Down: 'Down',
    Right: 'Right',
    Left: 'Left'
}

export const gameModes = {
    client: 'client',
    onlyClient: 'only-client',
    server: 'server'
}

export class EventsFactory {
    playerMoved(delta, playerNumber) {
        let direction
        if (delta.x > 0) {
            direction = directions.Right
        } else if (delta.x < 0) {
            direction = directions.Left
        } else if (delta.y > 0) {
            direction = directions.Down
        } else {
            direction = directions.Up
        }
        return {type: "PLAYER/MOVED", payload: {direction, playerNumber}}
    }
    googleJumped(x, y) {
        return {type: "GOOGLE/JUMPED", payload: {x, y}}
    }
    setStartPlayersPosition(x, y, playerNumber) {
        return {type: "PLAYER/SET-START-POSITION", payload: {x, y, playerNumber}}
    }
}

export class Game {
    #settings = {
        gridSize: {
            columnCount: 4,
            rowsCount: 4
        },
        googleJumpInterval: 2000,
        pointsToWin: 3,
        mode: gameModes.onlyClient
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
    eventEmitter
    #eventsFactory
    #winner

    constructor(name, eventEmitter, eventsFactory) {
        this.name = name
        this.eventEmitter = eventEmitter
        this.#eventsFactory = eventsFactory
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
        return [this.#player1.clone(), this.#player2.clone()]
    }

    get google() {
        return this.#google.clone()
    }

    get score() {
        return this.#score
    }

    #movePlayer(player, otherPlayer, delta) {
        const canMove = this.#canMoveOrOutOfBorders(player, delta)
        if (!canMove) return
        const canMoveOrOtherPlayer = this.#canMoveOrOtherPlayerBlocking(player, otherPlayer, delta)
        if (!canMoveOrOtherPlayer) return;
        if (delta.x) player.position = new Position(player.position.x + delta.x, player.position.y)
        if (delta.y) player.position = new Position(player.position.x, player.position.y + delta.y)
        this.#checkGoogleCatching(player)
        this.eventEmitter.emit("change", this.#eventsFactory.playerMoved(delta, player.number))
    }

    #canMoveOrOutOfBorders(player, delta) {
        const newPosition = player.position.clone()
        if (delta.x) {
            newPosition.x += delta.x
        }
        if (delta.y) {
            newPosition.y += delta.y
        }
        if (newPosition.x < 0 || newPosition.x >= this.#settings.gridSize.columnCount) return false
        if (newPosition.y < 0 || newPosition.y >= this.#settings.gridSize.rowsCount) return false
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
                this.#finishGame(player.number)
            } else {
                clearInterval(this.#googleJumpInterval)
                this.#moveGoogleToRandomPosition()
                this.#runGoogleJumpInterval()
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

    #createUnits() {
        const player1Position = this.#getRandomPosition([])
        this.#player1 = new Player(player1Position, 1)
        this.eventEmitter.emit('change',
            this.#eventsFactory.setStartPlayersPosition(player1Position.x, player1Position.y, 1))

        const player2Position = this.#getRandomPosition([player1Position])
        this.#player2 = new Player(player2Position, 2)
        this.eventEmitter.emit('change',
            this.#eventsFactory.setStartPlayersPosition(player2Position.x, player2Position.y, 2))

        this.#google = new Google()
        this.#moveGoogleToRandomPosition(true)
    }

    #createUnitsForClientMode() {
        this.#player1 = new Player(new Position(0, 0), 1)
        this.#player2 = new Player(new Position(0, 0), 2)
        this.#google = new Google(new Position(0, 0))
    }

    async start() {
        if (this.#status === 'pending') {
            this.#status = 'in-progress'
            if (this.#settings.mode !== gameModes.client) {
                this.#runGoogleJumpInterval()
                this.#createUnits()
            } else {
                this.#createUnitsForClientMode()
            }
        }
    }

    #runGoogleJumpInterval() {
        this.#googleJumpInterval = setInterval(() => {
            this.#moveGoogleToRandomPosition()
        }, this.#settings.googleJumpInterval)
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
        this.eventEmitter.emit("change", this.#eventsFactory.googleJumped(newGooglePosition.x, newGooglePosition.y))
    }
    setGooglePosition(x, y) {
        if (this.#settings.mode !== gameModes.client) {
            throw new Error('Impossible control Google position')
        }
        this.#google.position = new Position(x, y)
        this.eventEmitter.emit("change", this.#eventsFactory.googleJumped(this.#google.position.x, this.#google.position.y))
    }
    setPlayerPosition(x, y, playerNumber) {
        if (this.#settings.mode !== gameModes.client) {
            throw new Error('Impossible control Google position')
        }
        const player = playerNumber === 1 ? this.#player1 : this.#player2
        player.position = new Position(x, y)
        this.eventEmitter.emit("change",
        this.#eventsFactory.setStartPlayersPosition(player.position.x, player.position.y, playerNumber))
        //this.eventEmitter.emit("change")
    }
    #finishGame(playerNumber) {
        this.#status = 'finished'
        this.#winner = playerNumber
        clearInterval(this.#googleJumpInterval)
    }
    get winner(){
        return this.#winner
    }
}

class NumberUtil {
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}

export class Position {
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
    #position

    constructor(position) {
        this.#position = position
    }

    get position() {
        return new Position(this.#position.x, this.#position.y)
    }

    set position(position) {
        this.#position = position
    }
    clone() {
        return Object.assign(new this.constructor(), this, {position: this.#position.clone()})
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


//for tests
/*module.exports = {
    Game,
    Position
}*/
