const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../config/db');
const { onboardingQueue } = require('../services/queue');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/onboard', upload.single('document'), async (req, res) => {
    const { company_name, contact_name, contact_email } = req.body;

    if (!company_name || !contact_name || !contact_email) {
        return res.status(400).json({ error: 'company_name, contact_name, and contact_email are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO clients (company_name, contact_name, contact_email) VALUES ($1, $2, $3) RETURNING *',
            [company_name, contact_name, contact_email]
        );

        const client = result.rows[0];

        await onboardingQueue.add('send-welcome-email', {
            clientId: client.id,
            contactEmail: contact_email,
            contactName: contact_name,
            companyName: company_name,
        });

        if (req.file) {
            await onboardingQueue.add('upload-document', {
                clientId: client.id,
                fileBuffer: req.file.buffer.toString('base64'),
                originalFileName: req.file.originalname,
                mimeType: req.file.mimetype,
            });
        }

        res.status(201).json({ status: 'ok', client });
    } catch (err) {
        console.error('Error creating client:', err);
        res.status(500).json({ error: 'Failed to onboard client' });
    }
});

module.exports = router;