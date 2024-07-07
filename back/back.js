import { WebSocketServer } from 'ws';
import {EventEmitter} from '../utils/observer/eventEmitter.js';
import {directions, EventsFactory, Game, gameModes} from '../game.js';

const wss = new WebSocketServer({ port: 3000 });

const eventEmitter = new EventEmitter()
const eventsFactory = new EventsFactory()
const game = new Game("new game", eventEmitter, eventsFactory)
game.settings = {
    mode: gameModes.server
}

const connections = []

game.eventEmitter.subscribe('change', (e)=> {
    connections.forEach((ws) => {
        ws.send(JSON.stringify(e))
    })
})

wss.on('connection', async function connection(ws) {
    connections.push(ws)
    if (connections.length === 2) {
        await game.start()
        console.log('game started on server')
    }
    ws.on('message', function message(data) {
        const command = JSON.parse(data)
        if (command.commandType === "Move-Player") {
            switch (command.payload.direction) {
                case directions.Up:
                    game[`movePlayer${command.payload.playerNumber}ToUp`]()
                    break
                case directions.Down:
                    game[`movePlayer${command.payload.playerNumber}ToDown`]()
                    break
                case directions.Left:
                    game[`movePlayer${command.payload.playerNumber}ToLeft`]()
                    break
                case directions.Right:
                    game[`movePlayer${command.payload.playerNumber}ToRight`]()
                    break
            }
        }
    });
});