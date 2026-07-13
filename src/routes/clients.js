const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../config/db');
const { sendWelcomeEmail } = require('../services/email');
const { uploadDocument } = require('../services/s3');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/onboard', upload.single('document'), async (req, res) => {
    const { company_name, contact_name, contact_email } = req.body;

    if (!company_name || !contact_name || !contact_email) {
        return res.status(400).json({ error: 'company_name, contact_name, and contact_email are required' });
    }

    try {
        let documentKey = null;

        if (req.file) {
            try {
                documentKey = await uploadDocument(req.file.buffer, req.file.originalname, req.file.mimetype);
            } catch (uploadErr) {
                console.error('Document upload failed:', uploadErr);
            }
        }

        const result = await pool.query(
            'INSERT INTO clients (company_name, contact_name, contact_email, document_key) VALUES ($1, $2, $3, $4) RETURNING *',
            [company_name, contact_name, contact_email, documentKey]
        );

        try {
            await sendWelcomeEmail(contact_email, contact_name, company_name);
            console.log('Welcome email sent successfully to', contact_email);
        } catch (emailErr) {
            console.error('Client created but welcome email failed:', emailErr);
        }

        res.status(201).json({ status: 'ok', client: result.rows[0] });
    } catch (err) {
        console.error('Error creating client:', err);
        res.status(500).json({ error: 'Failed to onboard client' });
    }
});

module.exports = router;