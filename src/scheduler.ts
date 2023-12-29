
import {CronJob, cronJob} from '@loopback/cron';
// import {CustomerInfoRepository} from '../repositories';
import ProcessAgingDocProvider from './services/process-aging-doc.service';
import ProcessForCorrectDocProvider from './services/process-forCorrect-doc.service';
import ProcessLinkingDocProvider from './services/process-linking-doc.service';
import ProcessTransmissionDocProvider from './services/process-transmission-doc.service';
import ProcessUpdateDocProvider from './services/process-update-doc-service';

@cronJob()
export default class Scheduler extends CronJob {
  constructor(
    // @repository(CustomerInfoRepository) public customerInfoRepository: CustomerInfoRepository,
    name: string,
    cronTime: string
  ) {
    super({
      name,
      onTick: async () => {
        await this.sendToProcessor();
      },
      cronTime,
      start: true,
    });
    name = this.name
  }

  async fetchRecordsToLink() {
    // Fetch records from database
    // const response = await this.customerInfoRepository.count()
    // this.logger.log('info', `Fetching data from repositories`);
    const randRecordLen = Math.floor(Math.random() * (2000 - 700 + 100) + 100)
    const rand = Math.floor(Math.random() * (300 - 100 + 10) + 10)
    let response = []
    for (let i = 0; i < randRecordLen; i++) {
      response.push({
        id: i,
        filename: `${this.name}-document-${i}`,
        bitrate: rand
      })
    }
    return response
  }

  async fetchForCorrect() {
    // Fetch records from database
    const randRecordLen = Math.floor(Math.random() * (2000 - 700 + 100) + 100)
    const rand = Math.floor(Math.random() * (300 - 100 + 10) + 10)
    let response = []
    for (let i = 0; i < randRecordLen; i++) {
      response.push({
        id: i,
        filename: `${this.name}-document-${i}`,
        bitrate: rand
      })
    }
    return response
  }

  async fetchRecordsToTransmit() {
    const randRecordLen = Math.floor(Math.random() * (2000 - 700 + 100) + 100)
    const rand = Math.floor(Math.random() * (300 - 100 + 10) + 10)
    let response = []
    for (let i = 0; i < randRecordLen; i++) {
      response.push({
        id: i,
        filename: `${this.name}-document-${i}`,
        bitrate: rand
      })
    }
    return response
  }

  async fetchForUpdate() {
    // Fetch records from database
    const randRecordLen = Math.floor(Math.random() * (2000 - 700 + 100) + 100)
    const rand = Math.floor(Math.random() * (300 - 100 + 10) + 10)
    let response = []
    for (let i = 0; i < randRecordLen; i++) {
      response.push({
        id: i,
        filename: `${this.name}-document-${i}`,
        bitrate: rand
      })
    }
    return response
  }

  async fetchAging() {
    // Fetch records from database
    const randRecordLen = Math.floor(Math.random() * (2000 - 700 + 100) + 100)
    const rand = Math.floor(Math.random() * (300 - 100 + 10) + 10)
    let response = []
    for (let i = 0; i < randRecordLen; i++) {
      response.push({
        id: i,
        filename: `${this.name}-document-${i}`,
        bitrate: rand
      })
    }
    return response
  }

  async sendToProcessor() {
    console.log(this.name, `Scheduler: Fetching data from repositories`);
    try {
      switch (this.name) {
        case 'linking':
          let linkingResponse = await this.fetchRecordsToLink()
          const linkingResponseInstance = new ProcessLinkingDocProvider(linkingResponse, this.name)
          break;
        case 'transmission':
          let transmissionResponse = await this.fetchRecordsToTransmit()
          const transmissionResponseInstance = new ProcessTransmissionDocProvider(transmissionResponse, this.name)
          break;
        case 'readForCorrect':
          let forCorrectResponse = await this.fetchForCorrect()
          const forCorrectResponseInstance = new ProcessForCorrectDocProvider(forCorrectResponse, this.name)
          break;
        case 'updateDoc':
          let updateDocResponse = await this.fetchForUpdate()
          const updateDocResponseInstance = new ProcessUpdateDocProvider(updateDocResponse, this.name)
          break;
        case 'aging':
          let agingResponse = await this.fetchAging()
          const agingResponseInstance = new ProcessAgingDocProvider(agingResponse, this.name)
          break;
        default:
          break;
      }
    } catch (e) {
      throw (e)
    }
  }
}
