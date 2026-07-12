const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { sendWelcomeEmail } = require('../services/email');

router.post('/onboard', async (req, res) => {
    const { company_name, contact_name, contact_email } = req.body;

    if (!company_name || !contact_name || !contact_email) {
        return res.status(400).json({ error: 'company_name, contact_name, and contact_email are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO clients (company_name, contact_name, contact_email) VALUES ($1, $2, $3) RETURNING *',
            [company_name, contact_name, contact_email]
        );

        try {
            await sendWelcomeEmail(contact_email, contact_name, company_name);
            console.log('Welcome email sent successfully to', contact_email);
        } catch (emailErr) {
            console.error('Client created but welcome email failed:', JSON.stringify(emailErr.response?.body, null, 2));
        }

        res.status(201).json({ status: 'ok', client: result.rows[0] });
    } catch (err) {
        console.error('Error creating client:', err);
        res.status(500).json({ error: 'Failed to onboard client' });
    }
});

module.exports = router;