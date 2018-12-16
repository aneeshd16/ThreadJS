

class AdderThread extends Thread.default {

    constructor(begin, end) {
        super();
        this.begin = begin;
        this.end = end;
        console.log(`Start ${begin}, end ${end}`)
    }

    run() {
        let sum = 0;
        for (let index = this.begin; index <= this.end; index++) {
            if (index % 2 === 0)
                sum += index;
            else
                sum -= index;
        }
        return sum;
    }
}

class AdderMainThread {

    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
        console.log(`Start ${begin}, end ${end}`)
    }

    run() {
        let sum = 0;
        for (let index = this.begin; index <= this.end; index++) {
            if (index % 2 === 0)
                sum += index;
            else
                sum -= index;
        }
        return sum;
    }

    start() {
        return this.run();
    }
}

let count = 0;

setInterval(() => {
    if (count === 359) {
        count = 0;
    }
    document.getElementById('counter').style.transform = `rotate(-${count++}deg)`;
}, 10)

const getN = () => {
    return parseInt(document.getElementById("numberInput").value);
}

function calcuateMainThread() {
    document.getElementById('sumMain').innerText = ``;
    document.getElementById('timeMain').innerText = '';
    const st = window.performance.now();
    const n = getN();
    const adderMainThread = new AdderMainThread(0, n);
    const result = adderMainThread.start();
    document.getElementById('sumMain').innerText = `${result}`;
    document.getElementById('timeMain').innerText = window.performance.now() - st;
}

async function calcuateSeparateThread() {
    document.getElementById('sumWorker').innerText = ``;
    document.getElementById('timeWorker').innerText = '';
    const st = window.performance.now();
    const n = getN();
    const adderSeparateThread = new AdderThread(0, n);
    const result = await adderSeparateThread.start();
    document.getElementById('sumWorker').innerText = `${result}`;
    document.getElementById('timeWorker').innerText = window.performance.now() - st;
}

async function calcuateSeparateThreadPool() {
    document.getElementById('sumWorkerPool').innerText = ``;
    document.getElementById('timeWorkerPool').innerText = '';
    const st = window.performance.now();
    const n = getN();
    const promises = [];
    const bucketSize = n/10;
    let index;
    for (index = 0; index < n; index+=(bucketSize)) {
        const adderSeparateThread = new AdderThread(index, index + bucketSize - 1);
        promises.push(adderSeparateThread.start())
    }
    const adderSeparateThread = new AdderThread(index, n);
    promises.push(adderSeparateThread.start())
    const result = (await Promise.all(promises)).reduce((sum, value) => sum + value, 0);
    document.getElementById('sumWorkerPool').innerText = `${result}`;
    document.getElementById('timeWorkerPool').innerText = window.performance.now() - st;
}

window.calcuateMainThread = calcuateMainThread;
window.calcuateSeparateThread = calcuateSeparateThread;
window.calcuateSeparateThreadPool = calcuateSeparateThreadPool;