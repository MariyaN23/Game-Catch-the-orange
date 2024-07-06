class Observable {
    #subscibers = {}
    addEventListener(eventName, observer) {
        return this.subscribe(eventName, observer)
    }
    on(eventName, observer) {
        return this.subscribe(eventName, observer)
    }
    #findAndRemoveSubscriber(eventName, observer) {
        this.#subscibers[eventName] = this.#subscibers[eventName]?.filter(e => e !== observer)
    }
    off(eventName, observer) {
        this.#findAndRemoveSubscriber(eventName, observer)
    }
    subscribe(eventName, observer) {
        if (!this.#subscibers[eventName]) {
            this.#subscibers[eventName] = []
        }
        this.#subscibers[eventName].push(observer)
        return ()=> {
            this.#findAndRemoveSubscriber(eventName, observer)
        }
    }
    emit(eventName, data = null) {
        this.#subscibers[eventName]?.forEach(s => s(data))
    }
}