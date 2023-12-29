import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import Scheduler from './scheduler';
import {MySequence} from './sequence';

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

    // For Testing Single Process
    const schedClass: any = new Scheduler('transmission', '*/20 * * * * *')
    this.add(createBindingFromClass(schedClass));

    // Default: Loop all available processes
    // for (let item of config.schedule) {
    //   const {
    //     name,
    //     cronTime
    //   } = item
    //   const schedClass: any = new Scheduler(name, cronTime)
    //   this.add(createBindingFromClass(schedClass));
    // }
  }
}
