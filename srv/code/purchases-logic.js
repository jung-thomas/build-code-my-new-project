/**
 * 
 * @On(event = { "CREATE" }, entity = "loyaltyProgramSrv.Purchases")
 * @param {Object} request - User information, tenant-specific CDS model, headers and query parameters
*/
module.exports = async function(request) {
    const { data } = request;

    // Calculate reward points based on purchase value
    data.rewardPoints = Math.floor(data.purchaseValue / 10);

    // Update the total purchase value and total reward points of the related customer
    const customer = await SELECT.one.from('loyaltyProgramSrv.Customers').where({ ID: data.customer_ID });
    if (customer) {
        customer.totalPurchaseValue += data.purchaseValue;
        customer.totalRewardPoints += data.rewardPoints;
        await UPDATE('loyaltyProgramSrv.Customers').set({
            totalPurchaseValue: customer.totalPurchaseValue,
            totalRewardPoints: customer.totalRewardPoints
        }).where({ ID: data.customer_ID });
    }
}