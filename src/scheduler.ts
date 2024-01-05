/**
 * Author: Dan Vincent Tagailo
 * Vendor: --
 * Project: --
 * Feature: Job Scheduler (No Processor)
 */

import { CronJob, cronJob, asCronJob } from '@loopback/cron';
import { RestApplication } from '@loopback/rest';

import DogController from './controllers/dog.controller';
import CatController from './controllers/cat.controller';

import ProcessChickenProvider from './services/processors/process-chicken.service';

// import {CustomerInfoRepository} from '../repositories';

import { bold, italic } from 'chalk';

/**
  * UNIX Cron format:
  * https://github.com/kelektiv/node-cron#api
  *   field          allowed values
  *   -----          --------------
  *   second         0-59
  *   minute         0-59
  *   hour           0-23
  *   day of month   1-31
  *   month          1-12 (or names, see below)
  *   day of week    0-7 (0 or 7 is Sunday, or use names)
  * 
  * Other Ref: https://quadrixm.medium.com/running-a-cron-job-in-loopback-4-for-updating-a-database-table-using-a-loopback-repository-97fcf5c96e28
  **/

@cronJob()
export default class Scheduler extends CronJob {
  constructor(name: string, cronTime: string, public app: RestApplication) {
    // Do not insert code before super()
    super({
      name,
      onTick: () => {
        console.log(italic.magentaBright('->', 'scheduler:constructor', '=> Calling sendToProcessor function...'))
        this.sendToProcessor();
      },
      cronTime, // Please always use UNIX Cron format (recommended: 6 ticks or fields )
      start: true,
    });
    console.log(italic.magentaBright('->', 'scheduler:constructor', '=> Scheduler constructor is called'))
  }

  public name: string;
  public cronTime: string;
  public job: CronJob;

  // Call the controller
  async invokeController(ctrlName, functionName) {
    console.log(italic.magentaBright('->', `scheduler:invokeController`, `=> ${functionName} is invoked`))
    const ctrl = this.app.controller(ctrlName);
    const ctrlInstance: any = await ctrl.getValue(this.app)
    await ctrlInstance[functionName]()
  }

  async fetchChickenData() {
    // Fetch records from database
    // const response = await this.customerInfoRepository.count()
    // this.logger.log('info', `Fetching data from repositories`);
    const randRecordLen = Math.floor(Math.random() * (15 - 3) + 3)
    let response: any = []
    for (let i = 0; i < randRecordLen; i++) {
      response.push({
        id: i,
        filename: `${this.name}-document-${i}`,
        bitrate: Math.floor(Math.random() * (300 - 100) + 10)
      })
    }
    return response
  }

  async sendToProcessor() {
    console.log(italic.magentaBright('->', 'scheduler:sendToProcessor', '=> SendToProcesor has been called', this.name))
    try {
      switch (this.name) {
        case 'dog':
          let dogResponse = await this.invokeController(DogController, 'findDogs')
          break;
        case 'cat':
          let catResponse = await this.invokeController(CatController, 'findCats')
          break;
        case 'chicken':
          let chickenResponse = await this.fetchChickenData()
          const linkingResponseInstance = new ProcessChickenProvider(chickenResponse, this.name)
          break;
        default:
          break;
      }
    } catch (e) {
      throw (e)
    }
  }
}
