import nodemailer from 'nodemailer';
import appConfig from './appConfig.js';

const transporter = nodemailer.createTransport({    
    host: appConfig.MAIL_HOST,
    port: appConfig.MAIL_PORT,
    secure: false, // true for 465, false for other ports 
    auth: {
        user: appConfig.MAIL_USER, // generated ethereal user
        pass: appConfig.EMAIL_PASSWORD, // generated ethereal password
    },
});

export default transporter;