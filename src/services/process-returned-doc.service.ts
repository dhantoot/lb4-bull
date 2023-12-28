import { /* inject, */ BindingScope, Provider, injectable} from '@loopback/core';
// import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import Bull, {Job, Queue} from "bull";


@injectable({scope: BindingScope.SINGLETON})
export default class ProcessReturnedDocProvider implements Provider<Queue> {
  public queue: Queue;
  public job: Job;
  public data: any;
  // Inject a winston logger
  // @inject(LoggingBindings.WINSTON_LOGGER)
  // private logger: WinstonLogger;

  constructor(data: any) {
    // this.logger.log('info', `this.initialize has been called`);
    // console.log('info', `this.initialize has been called`)
    this.data = data
    this.initialize()
  }

  async value() {
    // this.logger.log('info', `Bull-Service:returnedDocProcessor injected`);
    // console.log('info', `Bull-Service:returnedDocProcessor injected`)
    return this.queue;
  }

  async returnedDocProcessor(job: Job) {
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

      // this.logger.log('info', `returnedDocProcessor: processing this data`, {
      //   opts,
      //   attemptsMade,
      //   data,
      //   timestamp,
      //   stacktrace,
      //   returnvalue,
      //   id,
      //   processedOn,
      //   failedReason,
      //   msg: `Done in ${sec} seconds`
      // });

      // console.log('returnedDocProcessor: processing this data', {
      //   opts,
      //   attemptsMade,
      //   data,
      //   timestamp,
      //   stacktrace,
      //   returnvalue,
      //   id,
      //   processedOn,
      //   failedReason,
      //   msg: `Done in ${sec} seconds`
      // })

      return new Promise(resolve => setTimeout(resolve, ms))
    } catch (e) {
      console.log('e', e)
      throw new Error(e)
    }
  }

  async start() {
    // this.logger.log('info', `start fn called`)
    // console.log('info', `start fn called`)
    try {
      this.queue.process(this.returnedDocProcessor);

      for (let item of this.data) {
        this.queue.add(
          item,
          {
            removeOnComplete: true,
            removeOnFail: false,
            lifo: true,
            attempts: 3,
            // repeat : {cron: '* * * * *'}
          }
        );
      }
    } catch (e) {
      // this.logger.error(e)
      throw new Error(e)
    }
  }

  async initialize() {
    // this.logger.log('info', `initializing bull instance..`, this.data)
    // console.log('info', `initializing bull instance..`, this.data)
    try {
      console.log('info', `processor: initializing bull instance..`, this.data)
      this.queue = new Bull("returnedDocProcessor", {
        redis: {port: 6379, host: '127.0.0.1'}
      });
      // this.logger.log('info', `initialize: this.queue`, this.queue.name)
      // console.log('info', `initializing bull instance..`, this.data)
      this.start()
    } catch (e) {
      // this.logger.error(e)
      throw new Error(e)
    }
  }
}
