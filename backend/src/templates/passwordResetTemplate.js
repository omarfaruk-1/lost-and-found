function passwordResetTemplate(link) {
    return `
        <!DOCTYPE html>
        <html>
            <body style="
                margin: 0;
                padding: 0;
                background-color: #f4f7fb;
                font-family: Arial, Helvetica, sans-serif;
                color: #1f2937;
            ">
                <div style="
                    width: 100%;
                    padding: 40px 16px;
                    box-sizing: border-box;
                ">
                    <div style="
                        max-width: 560px;
                        margin: 0 auto;
                        background: #ffffff;
                        border-radius: 16px;
                        overflow: hidden;
                        border: 1px solid #e5e7eb;
                    ">

                        <div style="
                            padding: 28px 32px;
                            background: #111827;
                            text-align: center;
                        ">
                            <h1 style="
                                margin: 0;
                                color: #ffffff;
                                font-size: 26px;
                            ">
                                Find<span style="color: #60a5fa;">
                                    Back
                                </span>
                            </h1>
                        </div>

                        <div style="
                            padding: 40px 32px;
                            text-align: center;
                        ">
                            <div style="
                                width: 56px;
                                height: 56px;
                                margin: 0 auto 22px;
                                border-radius: 50%;
                                background: #eff6ff;
                                color: #2563eb;
                                font-size: 26px;
                                line-height: 56px;
                            ">
                                🔒
                            </div>

                            <h2 style="
                                margin: 0 0 12px;
                                font-size: 24px;
                                color: #111827;
                            ">
                                Reset your password
                            </h2>

                            <p style="
                                margin: 0 auto 28px;
                                max-width: 420px;
                                font-size: 15px;
                                line-height: 1.7;
                                color: #6b7280;
                            ">
                                We received a request to reset your
                                FindBack password. Click the button
                                below to create a new password.
                            </p>

                            <a
                                href="${link}"
                                style="
                                    display: inline-block;
                                    padding: 13px 28px;
                                    background: #2563eb;
                                    color: #ffffff;
                                    text-decoration: none;
                                    border-radius: 8px;
                                    font-size: 15px;
                                    font-weight: 600;
                                "
                            >
                                Reset Password
                            </a>

                            <p style="
                                margin: 26px 0 0;
                                font-size: 13px;
                                color: #9ca3af;
                            ">
                                This link will expire in 20 minutes.
                            </p>
                        </div>

                        <div style="
                            padding: 22px 32px;
                            background: #f9fafb;
                            border-top: 1px solid #e5e7eb;
                            text-align: center;
                        ">
                            <p style="
                                margin: 0;
                                font-size: 13px;
                                color: #9ca3af;
                            ">
                                Best regards,<br>
                                <strong style="color: #4b5563;">
                                    FindBack Team
                                </strong>
                            </p>
                        </div>

                    </div>
                </div>
            </body>
        </html>
    `;
}

export default passwordResetTemplate;