// Файл myWorker.js
function sendRandomNumber() {
    const randomNumber = Math.random();
    postMessage(randomNumber);
}

setInterval(sendRandomNumber, 1000);