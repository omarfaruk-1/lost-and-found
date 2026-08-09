function claimApprovedTemplate( claimantName, itemName ) {
  return `
    <h2>Claim Approved</h2>

    <p>Hello <strong>${claimantName}</strong>,</p>

    <p>Congratulations! Your claim has been approved.</p>

    <p><strong>Item Name:</strong> ${itemName}</p>

    <p>
      Please contact the item owner to collect your item.
    </p>

    <br>

    <p>Thank you for using <strong>Lost and Found</strong>.</p>

    <br>

    <p>Best Regards,</p>
    <p><strong>Lost and Found Team</strong></p>
  `;
}

export default claimApprovedTemplate;