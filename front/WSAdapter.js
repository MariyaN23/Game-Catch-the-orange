import {EventEmitter} from '../utils/observer/eventEmitter.js';
import {socket} from './ws.js';

export class WSAdapter extends EventEmitter {
    #socket
    constructor(socket) {
        super()
        this.#socket = socket

        socket.onmessage = (eventAsString) => {
            const event = JSON.parse(eventAsString.data)
            this.emit('new-message', event)
        }
    }
    send(data) {
        socket.send(JSON.stringify(data))
    }
}