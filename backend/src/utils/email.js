const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send email
const sendEmail = async (options) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html: options.html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', options.to);
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, resetUrl) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0066FF;">Återställ ditt lösenord / Reset Your Password</h2>
            <p>Du har begärt att återställa ditt lösenord för ${process.env.COMPANY_NAME}.</p>
            <p>You requested to reset your password for ${process.env.COMPANY_NAME}.</p>
            <p>Klicka på länken nedan för att återställa ditt lösenord:</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0066FF; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                Återställ lösenord / Reset Password
            </a>
            <p>Om du inte begärde detta kan du ignorera detta e-postmeddelande.</p>
            <p>If you didn't request this, you can ignore this email.</p>
            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                Länken är giltig i 1 timme. / This link expires in 1 hour.
            </p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
            <p style="color: #6B7280; font-size: 12px;">
                ${process.env.COMPANY_NAME}<br>
                ${process.env.COMPANY_ADDRESS}<br>
                ${process.env.COMPANY_PHONE}
            </p>
        </div>
    `;

    await sendEmail({
        to: email,
        subject: 'Återställ lösenord / Password Reset',
        html
    });
};

// Send user invitation email
exports.sendUserInvitationEmail = async (email, registrationUrl) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0066FF;">Välkommen till 7HLager!</h2>
            <h3 style="color: #0066FF;">Welcome to 7HLager!</h3>
            <p>Du har blivit inbjuden att använda 7HLager systemet för ${process.env.COMPANY_NAME}.</p>
            <p>You have been invited to use the 7HLager system for ${process.env.COMPANY_NAME}.</p>
            <p>Klicka på länken nedan för att skapa ditt konto:</p>
            <p>Click the link below to create your account:</p>
            <a href="${registrationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0066FF; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                Skapa konto / Create Account
            </a>
            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                Länken är giltig i 7 dagar. / This link expires in 7 days.
            </p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
            <p style="color: #6B7280; font-size: 12px;">
                ${process.env.COMPANY_NAME}<br>
                ${process.env.COMPANY_ADDRESS}<br>
                ${process.env.COMPANY_PHONE}
            </p>
        </div>
    `;

    await sendEmail({
        to: email,
        subject: 'Inbjudan till 7HLager / Invitation to 7HLager',
        html
    });
};

// Send seasonal reminder email
exports.sendSeasonalReminderEmail = async (customer, season) => {
    const seasonText = season === 'summer' ? {
        sv: 'sommardäck',
        en: 'summer tires'
    } : {
        sv: 'vinterdäck',
        en: 'winter tires'
    };

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0066FF;">Dags att byta till ${seasonText.sv}!</h2>
            <p>Hej ${customer.first_name}!</p>
            <p>Det är dags att byta till ${seasonText.sv}. Dina däck finns lagrade hos oss.</p>
            <p>Kontakta oss för att boka tid för byte:</p>
            <p style="margin: 20px 0;">
                <strong>Telefon:</strong> ${process.env.COMPANY_PHONE}<br>
                <strong>E-post:</strong> ${process.env.COMPANY_EMAIL}
            </p>
            <p>Med vänliga hälsningar,<br>${process.env.COMPANY_NAME}</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
            <p style="color: #6B7280; font-size: 12px;">
                ${process.env.COMPANY_NAME}<br>
                ${process.env.COMPANY_ADDRESS}<br>
                ${process.env.COMPANY_PHONE}
            </p>
        </div>
    `;

    await sendEmail({
        to: customer.email,
        subject: `Dags att byta till ${seasonText.sv}!`,
        html
    });
};

module.exports = {
    sendEmail,
    sendPasswordResetEmail: exports.sendPasswordResetEmail,
    sendUserInvitationEmail: exports.sendUserInvitationEmail,
    sendSeasonalReminderEmail: exports.sendSeasonalReminderEmail
};
