/**
 * 
 * @On(event = { "CREATE" }, entity = "loyaltyProgramSrv.Redemptions")
 * @param {Object} req - User information, tenant-specific CDS model, headers and query parameters
*/
module.exports = async function(req) {
  const { redeemedAmount, customer } = req.data;

  // Fetch the customer's current reward points and redeemed points
  const [{ totalRewardPoints, totalRedeemedRewardPoints }] = await SELECT.from('loyaltyProgramSrv.Customers')
    .where({ ID: customer })
    .columns('totalRewardPoints', 'totalRedeemedRewardPoints');

  // Check if the customer has enough reward points to redeem
  if (totalRewardPoints < redeemedAmount) {
    req.reject(400, `Customer doesn't have enough reward points to redeem.`);
    return;
  }

  // Deduct the redeemed amount from the customer's total reward points
  // and add that to their total redeemed points
  const updatedRewardPoints = totalRewardPoints - redeemedAmount;
  const updatedRedeemedPoints = totalRedeemedRewardPoints + redeemedAmount;

  // Update the customer's reward points and redeemed points
  await UPDATE('loyaltyProgramSrv.Customers')
    .set({
      totalRewardPoints: updatedRewardPoints,
      totalRedeemedRewardPoints: updatedRedeemedPoints
    })
    .where({ ID: customer });
}