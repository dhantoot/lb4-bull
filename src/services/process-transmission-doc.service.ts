
import {BindingScope, Provider, injectable} from '@loopback/core';
import Bull, {Job, Queue} from "bull";
import config from '../config.json';


@injectable({scope: BindingScope.SINGLETON})
export default class ProcessTransmissionDocProvider implements Provider<Queue> {
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

  async transmissionDocProcessor(job: Job) {
    try {
      console.log('Per record info: ')
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

      const ms = Math.floor(Math.random() * (60000 - 1000 + 100) + 100)
      const sec = ms / 1000
      // save records to DB, do stuff
      return new Promise(resolve => setTimeout(resolve, ms))
    } catch (e) {
      throw new Error(e)
    }
  }

  async start() {
    try {
      this.queue.process(this.transmissionDocProcessor);

      // Implement Batch Logic here
      const {processor} = config

      const chunksize = 50;
      let chunks: Array<any> = [];
      this.data.forEach((item: any) => {
        if (!chunks.length || chunks[chunks.length - 1].length == chunksize)
          chunks.push([]);
        chunks[chunks.length - 1].push(item);
      });
      console.log(this.name, `Processor:start(fn): `, chunks.length)
      let delayPerRecordToProcess = 0
      for (let chunk of chunks) {
        chunk.forEach((item: any) => {
          this.queue.add(
            item,
            {
              removeOnComplete: true,
              removeOnFail: false,
              lifo: true,
              attempts: 3,
              delay: delayPerRecordToProcess += 5000
              // repeat : {cron: '* * * * *'} // This should not be used
            }
          );
          const ms = delayPerRecordToProcess / 1000
          console.log(`${item.id} ${item.name}`, ms) // Mali pa. TODO
        });
      }

    } catch (e) {
      throw new Error(e)
    }
  }

  async initialize() {
    const {port, host} = config.redis
    try {
      console.log(this.name, `Processor: Initializing instance with data length:`, this.data.length)
      this.queue = new Bull(
        this.name,
        {
          redis: {port, host},
          prefix: this.name
        }
      );
      this.start()
    } catch (e) {
      throw new Error(e)
    }
  }
}
