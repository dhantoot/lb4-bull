import {injectable, /* inject, */ BindingScope, Provider, service} from '@loopback/core';
import Bull, { Queue, Job } from "bull";

@injectable({scope: BindingScope.SINGLETON})
export default class ProcessReturnedDocProvider implements Provider<Queue> {
  constructor(/* Add @inject to inject parameters */) {}

  queue = new Bull("returnedDocProcessor", {
    redis: { port: 6379, host: "127.0.0.1" }
  });
  job: Job;

  async value() {
    console.log('Bull-Service:returnedDocProcessor injected')
    
    return this.queue;
  }

  async getProgress () {
    return this.job.progress()
  }

  async saveToDB () {
    console.log('saving data to db...')
    return new Promise(resolve => setTimeout(resolve, 5000)); 
  }

  async returnedDocProcessor(job: Job) {
    this.job = job
    const attemptsMade = job.attemptsMade
    
    let { data } = job;
    let { id } = data;
    console.log({
      id,
      attemptsMade
    })
    
    // const resp = await this.saveToDB()
    // if (resp) {
    //   await job.moveToCompleted()
    //   return Promise.resolve()
    // }

    // const ms = Math.floor(Math.random() * (30000 - 10000 + 1000) + 1000)
    // const sec = ms/1000
  }

  async initialize() {
    console.log('Bull-Service:returnedDocProcessor added and processed')
    this.queue.process(this.returnedDocProcessor);
    // get data from repositories and load them here
    let data = [
      {
        id: 1,
        filename: 'returned_doc1.pdf',
        bitrate: 2,
      },
      {
        id: 2,
        filename: 'returned_doc2.pdf',
        bitrate: 2,
      },
      {
        id: 3,
        filename: 'returned_doc3.pdf',
        bitrate: 2,
      },
      {
        id: 4,
        filename: 'returned_doc4.pdf',
        bitrate: 2,
      },
      {
        id: 5,
        filename: 'returned_doc5.pdf',
        bitrate: 2,
      },
      {
        id: 6,
        filename: 'returned_doc6.pdf',
        bitrate: 2,
      },
      {
        id: 7,
        filename: 'returned_doc7.pdf',
        bitrate: 2,
      },
      {
        id: 8,
        filename: 'returned_doc8.pdf',
        bitrate: 2,
      },
      {
        id: 9,
        filename: 'returned_doc9.pdf',
        bitrate: 2,
      },
      {
        id: 10,
        filename: 'returned_doc10.pdf',
        bitrate: 2,
      }
    ]
    for (let item of data) {
      this.queue.add(
        item,
        { removeOnComplete: false, removeOnFail: false, lifo: true }
      );
    }
  }

}
