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
});