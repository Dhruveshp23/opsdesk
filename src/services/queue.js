const { Queue } = require('bullmq');

const connection = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
};

const onboardingQueue = new Queue('onboarding-tasks', { connection });

module.exports = { onboardingQueue, connection };