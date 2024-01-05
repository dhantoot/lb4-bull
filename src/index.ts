import { ApplicationConfig, HofsteeApplication } from './application';
import { createBindingFromClass } from '@loopback/core';
export * from './application';
import Scheduler from './scheduler';
import config from '../config';
import {bold} from 'chalk';

export async function main(options: ApplicationConfig = {}) {
  const app = new HofsteeApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  console.log(config)
  const { schedule } = config;
  for (const name in schedule) {
    console.log('name', name)
    const { cronTime, isActive } = schedule[name]

    if (isActive) {
      console.log(bold.bgCyanBright('->', 'Activated job: ', name))
      const schedClass: any = new Scheduler(name, cronTime, app)
      app.add(createBindingFromClass(schedClass));
    }
  }

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
