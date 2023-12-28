import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {LoggingBindings, LoggingComponent} from '@loopback/logging';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import Scheduler from './scheduler';
import config from './config.json'

export {ApplicationConfig};

export class HofsteeApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.component(CronComponent);
    // this.add(createBindingFromClass(Scheduler));
    this.component(LoggingComponent);
    
    for (let item of config.schedule) {
      const {
        name,
        cronTime
      } = item
      const schedClass: any = new Scheduler(name, cronTime)
      this.add(createBindingFromClass(schedClass));
    }
    // this.configure(LoggingBindings.COMPONENT).to({
    //   enableFluent: true, // default to true
    //   enableHttpAccessLog: true, // default to true
    // });
    // this.configure(LoggingBindings.WINSTON_LOGGER).to({
    //   host: process.env.FLUENTD_SERVICE_HOST ?? 'localhost',
    //   port: +(process.env.FLUENTD_SERVICE_PORT_TCP ?? 3000),
    //   timeout: 3.0,
    //   reconnectInterval: 600000, // 10 minutes
    // });
  }
}
