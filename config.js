require('dotenv').config();

module.exports = {
  schedule: {
    dog: {
      cronTime: "0 */1 * * * *",
      isActive: 1
    },
    cat: {
      cronTime: '20 * * * * *',
      isActive: 1
    },
    chicken: {
      cronTime: "30 * * * * *",
      isActive: 1
    },
    pig: {
      cronTime: "0 */5 * * * *",
      isActive: 0
    },
    lion: {
      cronTime: "0 0 22 * * *",
      isActive: 0
    },
  },
  processor: {
    chickenJob: {
      chunksize: 3,
      frequency: 5000,
      failedRetries: 3
    },
  },
  redis: {
    "port": 6379,
    "host": "127.0.0.1"
  }
};
