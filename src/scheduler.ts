
import {CronJob, cronJob} from '@loopback/cron';
// import {ReportRepository} from '../repositories';
import {inject} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import ProcessReturnedDocProvider from './services/process-returned-doc.service';

@cronJob()
export default class Scheduler extends CronJob {
  constructor(
    // @repository(ReportRepository) public reportRepository: ReportRepository,
    name: string,
    cronTime: string
  ) {
    super({
      name,
      onTick: async () => {
        // do the work
        await this.performMyJob();
      },
      cronTime,
      start: true,
    });
  }

  // Inject a winston logger
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;
  // @logInvocation()
  async performMyJob() {
    // const count = await this.reportRepository.count()
    // this.logger.log('info', `Fetching data from repositories`);
    console.log('info', `Scheduler: Fetching data from repositories ${this.name}`);
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
    const xx = new ProcessReturnedDocProvider(data)
  }
}
