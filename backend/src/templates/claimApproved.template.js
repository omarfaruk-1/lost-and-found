function claimApprovedTemplate(claimantName, itemName) {
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

            <!-- Header -->
            <div style="
              padding: 28px 32px;
              background: #111827;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 26px;
                letter-spacing: -0.5px;
              ">
                Find<span style="color: #60a5fa;">Back</span>
              </h1>
            </div>

            <!-- Content -->
            <div style="
              padding: 40px 32px;
              text-align: center;
            ">
              <div style="
                width: 58px;
                height: 58px;
                margin: 0 auto 22px;
                border-radius: 50%;
                background: #ecfdf5;
                color: #059669;
                font-size: 28px;
                line-height: 58px;
              ">
                ✓
              </div>

              <h2 style="
                margin: 0 0 12px;
                font-size: 24px;
                color: #111827;
              ">
                Claim approved
              </h2>

              <p style="
                margin: 0 auto 26px;
                max-width: 430px;
                font-size: 15px;
                line-height: 1.7;
                color: #6b7280;
              ">
                Hello <strong style="color: #111827;">
                  ${claimantName}
                </strong>,
                your claim has been approved.
              </p>

              <!-- Item -->
              <div style="
                padding: 18px 20px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                margin-bottom: 24px;
                text-align: left;
              ">
                <p style="
                  margin: 0;
                  font-size: 14px;
                  color: #6b7280;
                ">
                  <strong style="color: #374151;">
                    Item:
                  </strong>
                  ${itemName}
                </p>
              </div>

              <p style="
                margin: 0;
                font-size: 14px;
                line-height: 1.7;
                color: #6b7280;
              ">
                Please contact the item owner to arrange
                collection of your item.
              </p>
            </div>

            <!-- Footer -->
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
                Thank you for using <strong style="color: #4b5563;">
                  FindBack
                </strong>.
                <br><br>
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

export default claimApprovedTemplate;