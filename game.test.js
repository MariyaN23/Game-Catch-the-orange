const {Game} = require('./game')

describe('game test', () => {
    let game
    beforeEach(() => {
        game = new Game()
    })

    afterEach(() => {
        game.stop()
    })

    it('settings test', () => {
        game.settings = {
            gridSize: {
                columnCount: 5,
                rowsCount: 4
            }
        }
        const settings = game.settings
        expect(settings.gridSize.columnCount).toBe(5)
        expect(settings.gridSize.rowsCount).toBe(4)
    })

    it('start game test', async () => {
        expect(game.status).toBe('pending')
        await game.start()
        expect(game.status).toBe('in-progress')
    })

    it('check player init position', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()
            game.settings = {
                gridSize: {
                    columnCount: 1,
                    rowsCount: 3
                }
            }
            await game.start()
            expect([0]).toContain(game.players[0].position.x)
            expect([0, 1, 2]).toContain(game.players[0].position.y)

            expect([0]).toContain(game.players[1].position.x)
            expect([0, 1, 2]).toContain(game.players[1].position.y)

            expect(game.players[0].position.x !== game.players[1].position.x
                || game.players[0].position.y !== game.players[1].position.y).toBe(true)

            await game.stop()
        }
    })

    it('check google init position', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()
            game.settings = {
                gridSize: {
                    columnCount: 1,
                    rowsCount: 3
                }
            }
            await game.start()
            expect([0]).toContain(game.google.position.x)
            expect([0, 1, 2]).toContain(game.google.position.y)

            expect(
                (game.google.position.x !== game.players[0].position.x || game.google.position.y !== game.players[0].position.y)
                && (game.google.position.x !== game.players[1].position.x || game.google.position.y !== game.players[1].position.y))
                .toBe(true)

            await game.stop()
        }
    })

    it('check google position after jump', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()
            game.settings = {
                gridSize: {
                    columnCount: 1,
                    rowsCount: 4
                },
                googleJumpInterval: 100,
            }
            await game.start()
            const prevPosition = game.google.position.clone()
            await sleep(150)
            expect(game.google.position.equal(prevPosition)).toBe(false)

            await game.stop()
        }
    })

    it('catch google by player 1 and player 2 for one row (y)', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()
            game.settings = {
                gridSize: {
                    columnCount: 3, //x
                    rowsCount: 1 //y
                }
            }
            await game.start()
            const deltaForPlayer1 = game.google.position.x - game.players[0].position.x

            const prevPosition = game.google.position.clone()

            if (Math.abs(deltaForPlayer1) === 2) {
                const deltaForPlayer2 = game.google.position.x - game.players[1].position.x
                if (deltaForPlayer2 > 0) game.movePlayer2ToRight()
                else game.movePlayer2ToLeft()

                expect(game.score[1].points).toBe(0)
                expect(game.score[2].points).toBe(1)
            } else {
                if (deltaForPlayer1 > 0) game.movePlayer1ToRight()
                else game.movePlayer1ToLeft()

                expect(game.score[1].points).toBe(1)
                expect(game.score[2].points).toBe(0)
            }

            expect(game.google.position.equal(prevPosition)).toBe(false)

            await game.stop()
        }
    })

    it('catch google by player 1 and player 2 for one column (x)', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()
            game.settings = {
                gridSize: {
                    columnCount: 1, //x
                    rowsCount: 3 //y
                }
            }
            await game.start()
            const deltaForPlayer1 = game.google.position.y - game.players[0].position.y

            const prevPosition = game.google.position.clone()

            if (Math.abs(deltaForPlayer1) === 2) {
                const deltaForPlayer2 = game.google.position.y - game.players[1].position.y
                if (deltaForPlayer2 > 0) game.movePlayer2ToDown()
                else game.movePlayer2ToUp()

                expect(game.score[1].points).toBe(0)
                expect(game.score[2].points).toBe(1)
            } else {
                if (deltaForPlayer1 > 0) game.movePlayer1ToDown()
                else game.movePlayer1ToUp()

                expect(game.score[1].points).toBe(1)
                expect(game.score[2].points).toBe(0)
            }

            expect(game.google.position.equal(prevPosition)).toBe(false)

            await game.stop()
        }
    })

    it('one of two players should win', async () => {
        game = new Game()
        game.settings = {
            gridSize: {
                columnCount: 3,
                rowsCount: 1
            },
            pointsToWin: 3
        }
        await game.start()
        const deltaForPlayer1 = game.google.position.x - game.players[0].position.x
        if (Math.abs(deltaForPlayer1) === 2) {
            const deltaForPlayer2 = game.google.position.x - game.players[1].position.x
            if (deltaForPlayer2 > 0) {
                game.movePlayer2ToRight()
                game.movePlayer2ToLeft()
                game.movePlayer2ToRight()
            } else {
                game.movePlayer2ToLeft()
                game.movePlayer2ToRight()
                game.movePlayer2ToLeft()
            }
            expect(game.score[1].points).toBe(0)
            expect(game.score[2].points).toBe(3)
        } else {
            if (deltaForPlayer1 > 0) {
                game.movePlayer1ToRight()
                game.movePlayer1ToLeft()
                game.movePlayer1ToRight()
            } else {
                game.movePlayer1ToLeft()
                game.movePlayer1ToRight()
                game.movePlayer1ToLeft()
            }

            expect(game.score[1].points).toBe(3)
            expect(game.score[2].points).toBe(0)
        }
        expect(game.status).toBe('finished')
        await game.stop()
        expect(game.status).toBe('stopped')
    })
});

const sleep = ms => new Promise(res => setTimeout(res, ms))