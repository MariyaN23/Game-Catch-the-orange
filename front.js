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

startGame()