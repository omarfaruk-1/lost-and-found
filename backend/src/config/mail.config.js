import nodemailer from 'nodemailer';
import appConfig from './appConfig.js';

const transporter = nodemailer.createTransport({    
    host: appConfig.MAIL_HOST,
    port: appConfig.MAIL_PORT,
    secure: false,
    auth: {
        user: appConfig.MAIL_USER,
        pass: appConfig.EMAIL_PASSWORD,
    },
});

export default transporter;