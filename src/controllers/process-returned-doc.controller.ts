import {inject, service} from '@loopback/core';
import {
  Request,
  RestBindings,
  get,
  response,
  ResponseObject,
  param,
  patch,
  post,
  put,
  requestBody,
  del
} from '@loopback/rest';
import ProcessReturnedDocProvider from '../services/process-returned-doc.service'
import Bull, { Queue, Job } from "bull";

/**
 * OpenAPI response for ping()
 */
const SIMPLE_RESPONSE: ResponseObject = {
  description: 'Simple Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'SimpleResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class ProcessReturnedDocController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @service(ProcessReturnedDocProvider) public queue: Queue
  ) {}

  // Map to `GET /processReturnedDoc`
  @response(200, SIMPLE_RESPONSE) 
  @get('/returned_status')
  async status(@param.path.string('tag') id: string): Promise<any> {
    // console.log(await this.queue.getRepeatableJobs())
    console.log(await this.queue.getFailedCount())
    console.log(await this.queue.getCompletedCount())
    console.log('--------')
    console.log(await this.queue.count())
    console.log('--------')
    console.log(await this.queue.getFailed())
    console.log(await this.queue.getCompleted())
    return {
      greeting: 'Porcessing Returned Documents',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @response(200, SIMPLE_RESPONSE)
  @get('/pauseReturnedDocProcess')
  async pauseReturnedDocProcess(): Promise<any> {
    console.log('Pause returned document processing..')
    await this.queue.pause();
    return {
      greeting: 'Paused',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @response(200, SIMPLE_RESPONSE)
  @get('/resumeReturnedDocProcess')
  async resumeReturnedDocProcess(): Promise<any> {
    console.log('resume returned document processing..')
    await this.queue.resume();
    return {
      greeting: 'Resumed',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}