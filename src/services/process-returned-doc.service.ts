import {injectable, /* inject, */ BindingScope, Provider, service} from '@loopback/core';
import Bull, { Queue, Job } from "bull";
import { AnyARecord } from 'dns';
import { resolve } from 'path';

@injectable({scope: BindingScope.SINGLETON})
export default class ProcessReturnedDocProvider implements Provider<Queue> {
  public queue: Queue;
  public job: Job;

  constructor(/* Add @inject to inject parameters */) {}
  
  async value() {
    console.log('Bull-Service:returnedDocProcessor injected')
    
    return this.queue;
  }

  xxx(data: any) {
    console.log('hay nakooo', data.id)
    // try {
    //   return Promise.resolve(true)
    // } catch (e) {
    //   console.log('xxx:e', e)
    //   throw new Error(e)
    // }
    const ms = Math.floor(Math.random() * (10000 - 1000 + 100) + 100)
    const sec = ms/1000
    return new Promise(resolve => setTimeout(resolve, ms))
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
      
      const ms = Math.floor(Math.random() * (10000 - 1000 + 100) + 100)
      const sec = ms/1000

      console.log('returnedDocProcessor: processing this data', {
        opts,
        attemptsMade,
        data,
        timestamp,
        stacktrace,
        returnvalue,
        id,
        processedOn,
        failedReason,
        msg: `Done in ${sec} seconds`
      })

      return new Promise(resolve => setTimeout(resolve, ms))
    } catch (e) {
      console.log('e', e)
      throw new Error(e)
    }
  }

  async start() {
    console.log('start fn called')
    try {
      this.queue.process(this.returnedDocProcessor);

      // get All data from DB(repositories) for the whole day and load them here
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
      // Algo for batch processing should be done here
      for (let item of data) {
        this.queue.add(
          item,
          { removeOnComplete: true,
            removeOnFail: false,
            lifo: true,
            attempts: 3,
            // repeat : {cron: '* * * * *'}
          }
        );
      }
    } catch(e) {
      console.log('e', e)
      throw new Error(e)
    }
  }

  async initialize() {
    console.log('initialize: initializing bull instance..')
    try {
      this.queue = new Bull("returnedDocProcessor", {
        redis: { port: 6379, host: "127.0.0.1" }
      });
      console.log('initialize: this.queue', this.queue.name)
      this.start()
    } catch (e) {
      console.log('initialize: e', e)
      throw new Error(e)
    }
  }
}