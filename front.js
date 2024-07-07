import {EventsFactory, Game} from './game.js';
import {EventEmitter} from './utils/observer/eventEmitter.js';
import {GameComponent} from './view.js';
import {Controller} from './controller.js';
import {socket} from './front/ws-adapter.js';

const startGame = async () => {
    const eventEmitter = new EventEmitter()
    const eventsFactory = new EventsFactory()
    const game = new Game("new game", eventEmitter, eventsFactory)
    await game.start()

    const controller = new Controller(game)
    const view = new GameComponent(controller, game)
    view.render()

}

startGame()