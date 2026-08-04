
import appConfig from "../config/appConfig.js";
import transporter from "../config/mail.config.js";


async function sendVerificationEmail(email , token ) {
    const verificationLink = `${appConfig.FRONTEND_URL}/verify-email?token=${token}`;

    const info=await transporter.sendMail({
        from: `"Lost and Found" <${appConfig.MAIL_USER}>`,
        to: email,
        subject: "Email Verification",
        html:`
            <h2>Email verification</h2>
            <p>Click the link below to verify your email address:</p>
            <a href="${verificationLink}">Verify Email</a>
        `
    });

    return info;

}

export default sendVerificationEmail;