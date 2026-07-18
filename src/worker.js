require('dotenv').config();
const { Worker } = require('bullmq');
const { connection } = require('./services/queue');
const { sendWelcomeEmail } = require('./services/email');
const { uploadDocument } = require('./services/s3');
const pool = require('./config/db');

const worker = new Worker('onboarding-tasks', async (job) => {
    console.log(`Processing job: ${job.name} for client ${job.data.clientId}`);

    if (job.name === 'send-welcome-email') {
        const { contactEmail, contactName, companyName } = job.data;
        await sendWelcomeEmail(contactEmail, contactName, companyName);
        console.log(`Welcome email sent to ${contactEmail}`);
    }

    if (job.name === 'upload-document') {
        const { clientId, fileBuffer, originalFileName, mimeType } = job.data;
        const buffer = Buffer.from(fileBuffer, 'base64');
        const documentKey = await uploadDocument(buffer, originalFileName, mimeType);

        await pool.query(
            'UPDATE clients SET document_key = $1 WHERE id = $2',
            [documentKey, clientId]
        );
        console.log(`Document uploaded for client ${clientId}: ${documentKey}`);
    }
}, { connection });

worker.on('completed', (job) => {
    console.log(`Job ${job.id} (${job.name}) completed successfully`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} (${job.name}) failed:`, err.message);
});

console.log('OpsDesk worker started, listening for jobs...');