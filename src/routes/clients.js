const express = require('express');
const router = express.Router();
const pool = require('../config/db');

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
        res.status(201).json({ status: 'ok', client: result.rows[0] });
    } catch (err) {
        console.error('Error creating client:', err);
        res.status(500).json({ error: 'Failed to onboard client' });
    }
});

module.exports = router;