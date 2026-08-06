function claimTemplate({ ownerName, claimantName, itemName }) {
  return `
    <h2>New Claim Submitted</h2>

    <p>Hello <strong>${ownerName}</strong>,</p>

    <p>A new claim has been submitted for your item.</p>

    <p><strong>Item Name:</strong> ${itemName}</p>
    <p><strong>Claimant Name:</strong> ${claimantName}</p>

    <p>
      Please review this claim and approve or reject it from your dashboard.
    </p>

    <br>

    <p>Best Regards,</p>
    <p><strong>Lost and Found Team</strong></p>
  `;
}

export default claimTemplate;