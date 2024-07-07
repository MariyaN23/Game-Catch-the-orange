export const socket = new WebSocket("ws://localhost:3000")

socket.onopen = function (event) {
    console.log('Соединение установлено')
    socket.send('Привет от фронта')
}

socket.onmessage = function (event) {
    console.log(`Получено сообщение: ${event.data}`)
}