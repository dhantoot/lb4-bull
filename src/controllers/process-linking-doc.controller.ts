import {inject, service} from '@loopback/core';
import {
  Request,
  RestBindings,
  get,
  response,
  ResponseObject,
} from '@loopback/rest';
import ProcessLinkingDocProvider from '../services/process-linking-doc.service'
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
export class ProcessLinkingDocController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @service(ProcessLinkingDocProvider) public queue: Queue
  ) {}

  // Map to `GET /processLinkingDoc`
  // @response(200, SIMPLE_RESPONSE) 
  // @get('/processLinkingDoc')
  // async processLinkingDoc(): Promise<any> {
  //   console.log('Aloha')
  //   return {
  //     greeting: 'Porcessing Linking Documents',
  //     date: new Date(),
  //     url: this.req.url,
  //     headers: Object.assign({}, this.req.headers),
  //   };
  // }

  @response(200, SIMPLE_RESPONSE)
  @get('/pauseLinkingDocProcess')
  async pauseLinkingDocProcess(): Promise<any> {
    console.log('Pause Linking document processing..')
    await this.queue.pause();
    return {
      greeting: 'Paused',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @response(200, SIMPLE_RESPONSE)
  @get('/resumeLinkingDocProcess')
  async resumeLinkingDocProcess(): Promise<any> {
    console.log('resume Linking document processing..')
    await this.queue.resume();
    return {
      greeting: 'Resumed',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}