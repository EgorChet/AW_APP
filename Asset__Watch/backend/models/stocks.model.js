// models/stocks.model.js
import { db } from "../config/db.js";

export const addUserStock = async (
  userId,
  stockSymbol,
  sharesInput,
  averagePriceInput,
  additionalData
) => {
  const shares = parseInt(sharesInput, 10);
  const averagePrice = parseFloat(averagePriceInput);
  const currentPrice = parseFloat(additionalData.latestPrice);
  // console.log("Parsed shares:", shares, "Parsed average price:", averagePrice);
  // // Perform this right after parsing sharesInput and averagePriceInput to ensure they're parsed correctly.
  // console.log("Parsed shares:", shares, "Parsed average price:", averagePrice);
  // // Perform this right after parsing sharesInput and averagePriceInput to ensure they're parsed correctly.

  const totalValue = shares * currentPrice; // Calculate total value
  const currentGains = (currentPrice - averagePrice) * shares; // Calculate current gains
  const currentGainsPercentage = ((currentPrice - averagePrice) / averagePrice) * 100; // Calculate current gains percentage

  // Check if the stock already exists for the user
  const existingStock = await db("user_stocks")
    .where({
      user_id: userId,
      stock_symbol: stockSymbol,
    })
    .first();

  if (existingStock) {
    // Ensure existing shares and average price are treated as numbers
    const existingShares = parseInt(existingStock.numberofshares, 10);
    const existingAveragePrice = parseFloat(existingStock.average_price);

    // // Before calculating newAveragePrice, totalShares, newTotalValue, etc.
    // console.log("Existing shares:", existingShares, "New shares:", shares);
    // console.log(
    //   "Existing average price:",
    //   existingAveragePrice,
    //   "New average price:",
    //   averagePrice
    // );
    // Calculate the new total shares and new average price
    const totalShares = existingShares + shares;
    const newAveragePrice =
      (existingShares * existingAveragePrice + shares * averagePrice) / totalShares;
    const newTotalValue = totalShares * currentPrice; // Recalculate total value for the updated shares
    const newCurrentGains = (currentPrice - newAveragePrice) * totalShares; // Recalculate current gains
    const newCurrentGainsPercentage = ((currentPrice - newAveragePrice) / newAveragePrice) * 100; // Recalculate current gains percentage

    // console.log("Updating stock with:", {
    //   userId,
    //   stockSymbol,
    //   totalShares,
    //   newAveragePrice,
    //   currentPrice,
    //   newTotalValue,
    //   newCurrentGains,
    //   newCurrentGainsPercentage,
    //   companyName: additionalData.companyName,
    //   purchaseDate: additionalData.purchase_date,
    // });

    // Proceed with the update operation
    return db("user_stocks").where({ id: existingStock.id }).update({
      numberofshares: totalShares,
      average_price: newAveragePrice,
      current_price: currentPrice,
      total_value: newTotalValue,
      current_gains: newCurrentGains,
      current_gains_percentage: newCurrentGainsPercentage,
      company_name: additionalData.companyName,
      purchase_date: additionalData.purchase_date,
    });
  } else {
    // Log the values before inserting a new stock
    console.log("Inserting new stock with:", {
      userId,
      stockSymbol,
      shares,
      averagePrice,
      currentPrice,
      totalValue,
      currentGains,
      currentGainsPercentage,
      companyName: additionalData.companyName,
      purchaseDate: additionalData.purchase_date,
    });

    // Proceed with the insert operation
    return db("user_stocks").insert({
      user_id: userId,
      stock_symbol: stockSymbol,
      numberofshares: shares,
      average_price: averagePrice,
      current_price: currentPrice,
      total_value: totalValue,
      current_gains: currentGains,
      current_gains_percentage: currentGainsPercentage,
      company_name: additionalData.companyName,
      purchase_date: additionalData.purchase_date,
    });
  }
};

// export const addUserStock = (userId, stockSymbol, shares, averagePrice, additionalData) => {
//   // Assuming additionalData contains fields like currentPrice and companyName
//   return db("user_stocks").insert({
//     user_id: userId,
//     stock_symbol: stockSymbol,
//     shares,
//     average_price: averagePrice,
//     current_price: additionalData.latestPrice, // Example: using IEX Cloud data
//     company_name: additionalData.companyName,
//   });
// };

export const getUserStocks = (userId) => {
  // Now retrieving additional data along with the basic stock information
  return db("user_stocks")
    .where({ user_id: userId })
    .select(
      "user_id",
      "stock_symbol",
      "numberofshares",
      "average_price",
      "current_price",
      "company_name",
      "purchase_date",
      "total_value",
      "current_gains",
      "current_gains_percentage",
      "company_name",
      "purchase_date"
    );
};
