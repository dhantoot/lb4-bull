
import {BindingScope, Provider, injectable} from '@loopback/core';
import Bull, {Job, Queue} from "bull";
import config from '../../../config';


@injectable({scope: BindingScope.SINGLETON})
export default class ProcessChickenProvider implements Provider<Queue> {
  public queue: Queue;
  public job: Job;
  public data: any;
  public name: string;

  constructor(data: any, name: string) {
    this.data = data
    this.name = name
    this.initialize()
  }

  async value() {
    return this.queue;
  }

  async chickenProcessor(job: Job) {
    try {
      this.job = job
      const {
        opts,
        attemptsMade,
        data,
        timestamp,
        stacktrace,
        returnvalue,
        id,
        processedOn,
        failedReason
      } = job

      const ms = Math.floor(Math.random() * (3000 - 1000) + 1000)
      const sec = ms / 1000
      console.log(`chicken processing time is ${sec} seconds`)
      // save records to DB, do stuff
      setTimeout(() => {
        return Promise.resolve()
      }, ms)
    } catch (e: any) {
      throw new Error(e)
    }
  }

  async start() {
    try {
      this.queue.process(this.chickenProcessor);

      // Implement Batch Logic here
      const { processor: { chickenJob: { chunksize, frequency, failedRetries} } } = config
      let chunks: Array<any> = [];
      this.data.forEach((item: any) => {
        if (!chunks.length || chunks[chunks.length - 1].length == chunksize)
          chunks.push([]);
        chunks[chunks.length - 1].push(item);
      });


      console.log(this.name, `Processor: start(fn): chuncks length: `, chunks.length)
      let delayPerBatchToProcess = 0
      for await (const chunk of chunks) {
        for await (const item of chunk) {
          this.queue.add(
            item,
            {
              removeOnComplete: true,
              removeOnFail: false,
              lifo: true,
              attempts: failedRetries,
              delay: delayPerBatchToProcess
              // repeat : {cron: '* * * * *'} // This should not be used
            }
          );
          const sec = delayPerBatchToProcess / 1000
          console.log(`${item.id} ${item.filename} is set to process on `, sec, ' seconds')
        }
        delayPerBatchToProcess += frequency
      }
    } catch (e: any) {
      throw new Error(e)
    }
  }

  async initialize() {
    const {port, host} = config.redis
    try {
      console.log(this.name, `Processor: initializing instance with data length:`, this.data.length)
      this.queue = new Bull(
        this.name,
        {
          redis: {port, host},
          prefix: this.name
        }
      );
      this.start()
    } catch (e: any) {
      throw new Error(e)
    }
  }
}
