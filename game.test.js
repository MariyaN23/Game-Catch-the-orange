const {Game} = require ('./game')

describe('game test', ()=> {
    it ('settings test', ()=> {
        const game = new Game()
        game.settings = {
            gridSize: {
                x: 5,
                y: 4
            }
        }
        const settings = game.settings
        expect(settings.gridSize.y).toBe(4)
        expect(settings.gridSize.x).toBe(5)
    })

    it ('start game test', async ()=> {
        const game = new Game()
        expect(game.status).toBe('pending')
        await game.start()
        expect(game.status).toBe('in-progress')
    })

    it ('check player init position', async ()=> {
        for (let i=0; i<10; i++) {
            const game = new Game()
            game.settings = {
                gridSize: {
                    x: 1,
                    y: 2
                }
            }
            game.start()
            expect([0, 1]).toContain(game.players[0].position.x)
            expect([0, 1]).toContain(game.players[0].position.y)

            expect([0, 1]).toContain(game.players[1].position.x)
            expect([0, 1]).toContain(game.players[1].position.y)

            expect(game.players[0].position.x).not().toBe(game.players[1].position.x)
            expect(game.players[0].position.y).not().toBe(game.players[1].position.y)
        }
    })

});