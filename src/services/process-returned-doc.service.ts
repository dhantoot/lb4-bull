import {injectable, /* inject, */ BindingScope, Provider, service} from '@loopback/core';
import Bull, { Queue, Job } from "bull";

/*
 * Fix the service type. Possible options can be:
 * - import {BullJobs} from 'your-module';
 * - export type BullJobs = string;
 * - export interface BullJobs {}
 */

export function returnedDocProcessor(job: Job, done: any) {
  console.log(
    `Processing returned documents: ${job.data.filename}`,
    `bitrate: ${job.data.bitrate}`
  );
  const ms = Math.floor(Math.random() * (30000 - 10000 + 1000) + 1000)
  const sec = ms/1000
  setTimeout(() => {
    console.log('Done processing returned documents for this batch in ', sec, ' milliseconds')
    done()
  }, ms)
}

@injectable({scope: BindingScope.SINGLETON})
export default class ProcessReturnedDocProvider implements Provider<Queue> {
  constructor(/* Add @inject to inject parameters */) {}
  queue = new Bull("returnedDocProcessor", {
    redis: { port: 6379, host: "127.0.0.1" }
  });

  async value() {
    console.log('Bull-Service:returnedDocProcessor injected')
    
    return this.queue;
  }

  async initialize() {
    console.log('Bull-Service:returnedDocProcessor added and processed')
    this.queue.process(returnedDocProcessor);
    // get data from repositories and load them here
    await this.queue.add(
      {
        filename: 'returned_doc.pdf',
        bitrate: 320,
      }, {
        repeat:{ cron: '* * * * *' }
      }
    );
  }
}
