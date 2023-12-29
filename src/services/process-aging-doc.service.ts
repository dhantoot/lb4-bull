
import {BindingScope, Provider, injectable} from '@loopback/core';
import Bull, {Job, Queue} from "bull";
import config from '../config.json';


@injectable({scope: BindingScope.SINGLETON})
export default class ProcessAgingDocProvider implements Provider<Queue> {
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

  async agingDocProcessor(job: Job) {
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
      this.queue.process(this.agingDocProcessor);

      // Implement Batch Logic here

      for (let item of this.data) {
        this.queue.add(
          item,
          {
            removeOnComplete: true,
            removeOnFail: false,
            lifo: true,
            attempts: 3,
            // repeat : {cron: '* * * * *'} // This should not be used
          }
        );
      }
    } catch (e) {
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
    } catch (e) {
      throw new Error(e)
    }
  }
}
