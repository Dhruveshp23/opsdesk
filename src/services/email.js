const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendWelcomeEmail(clientEmail, contactName, companyName) {
    const msg = {
        to: clientEmail,
        from: process.env.FROM_EMAIL,
        subject: `Welcome to OpsDesk, ${companyName}!`,
        text: `Hi ${contactName},\n\nThanks for onboarding with us! We're excited to work with ${companyName}.\n\n- The OpsDesk team`,
        html: `<p>Hi ${contactName},</p><p>Thanks for onboarding with us! We're excited to work with <strong>${companyName}</strong>.</p><p>- The OpsDesk team</p>`,
    };

    await sgMail.send(msg);
}

module.exports = { sendWelcomeEmail };