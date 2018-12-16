import shortid from 'shortid';

class Thread {
  constructor() {
    this.threadId = shortid();
    console.log(`Init thread ${this.threadId}`);
    this.worker = null;
  }

  createWorker() {
    const fnString = this.run.toString()
    const blob = new Blob([`
      console.log('Running worker with threadId: ${this.threadId}');
      (async () => {
        const context = JSON.parse(\`${JSON.stringify(this).replace(/\\"/g, '"')}\`);
        async function ${fnString}
        run = run.bind(context);
        const result = await run();
        self.postMessage({result, context, threadId: '${this.threadId}'});
      })();
      `
    ], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    this.worker = new Worker(url);
  }

  run() {

  }

  start() {
    // run the run method in a worker
    console.log(`Starting ${this.threadId}`);
    return new Promise((resolve, reject) => {
      this.createWorker();
      this.worker.onmessage = (event) => {
        const { result, context, threadId} = event.data;
        if (threadId === this.threadId) {
          Object.assign(this, context);
          this.worker.terminate();
          return resolve(result);
        }
      }
    })
  }

  stop() {
    this.worker.terminate();
  }
}

export default Thread;
