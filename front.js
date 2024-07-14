import {EventsFactory, Game, gameModes} from './game.js';
import {EventEmitter} from './utils/observer/eventEmitter.js';
import {GameComponent} from './view.js';
import {Controller} from './controller.js';
import {socket} from './front/ws.js';
import {WSAdapter} from './front/WSAdapter.js';
import {Controller1} from './controller1.js';

const startGame = async () => {
    const eventEmitter = new EventEmitter()
    const eventsFactory = new EventsFactory()
    const wsAdapter = new WSAdapter(socket)
    const game = new Game("new game", eventEmitter, eventsFactory)
    const rows = document.getElementById('rows')
    const columns = document.getElementById('columns')
    const pointstowin = document.getElementById('pointstowin')
    const columnCount = Number(columns.value)
    const rowsCount = Number(rows.value)
    const pointsToWin = Number(pointstowin.value)
    game.settings = {
        gridSize: {
            columnCount,
            rowsCount
        },
        pointsToWin,
    }
    await game.start()
    let controller
    if (game.settings.mode === gameModes.onlyClient) {
        controller = new Controller1(game)
    } else {
        controller = new Controller(game, wsAdapter)
    }
    const view = new GameComponent(controller, game)
    view.render()
}

const StartButton = document.getElementById('start')
StartButton.addEventListener('click', startGame)

const rows = document.getElementById('rows')
const columns = document.getElementById('columns')
const pointstowin = document.getElementById('pointstowin')
rows.value = 4
columns.value = 4
pointstowin.value = 3