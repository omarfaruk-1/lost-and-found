function verificationTemplate(link) {
  return `
    <h2>Email Verification</h2>

    <p>Click the button below to verify your email.</p>

    <a href="${link}">Verify Email</a>

    <p>This link will expire in 20 minutes.</p>

    <br>

    <p>Best Regards,</p>
    <p>Lost and Found Team</p>
  `;
}

export default verificationTemplate;