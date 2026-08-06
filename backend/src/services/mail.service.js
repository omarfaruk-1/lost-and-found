
import appConfig from "../config/appConfig.js";
import transporter from "../config/mail.config.js";


async function sendMail(email , token ) {
    const verificationLink = `${appConfig.FRONTEND_URL}/verify-email?token=${token}`;

    const info=await transporter.sendMail({
        from: `"Lost and Found" <${appConfig.MAIL_USER}>`,
        to: email,
        subject,
        html
    })
}

export default sendMail;