// models/stocks.model.js
import { db } from "../config/db.js";
import axios from "axios";

export async function addUserStock(
  userId,
  stockSymbol,
  numberofshares,
  purchasePrice,
  purchaseDate
) {

  // Insert the new purchase record
  await db("purchases").insert({
    user_id: userId,
    stock_symbol: stockSymbol,
    number_of_stocks_purchased: numberofshares,
    purchase_price: purchasePrice,
    purchase_date: purchaseDate,
  });

  // Fetch the current stock price from IEX Cloud
  const { currentPrice, companyName } = await fetchCurrentStockPrice(stockSymbol);

  const calculateAggregateData = async (userId, stockSymbol) => {
    // Fetch all purchases for this user and stock symbol
    const purchases = await db("purchases")
      .where({ user_id: userId, stock_symbol: stockSymbol })
      .select("number_of_stocks_purchased", "purchase_price");

    // Calculate total purchased amount and total shares
    let totalPurchasedAmount = 0;
    let totalShares = 0;
    purchases.forEach((purchase) => {
      totalPurchasedAmount += purchase.number_of_stocks_purchased * purchase.purchase_price;
      totalShares += purchase.number_of_stocks_purchased;
    });

    // Calculate average price
    const averagePrice = totalShares > 0 ? totalPurchasedAmount / totalShares : 0;

    return { totalShares, averagePrice };
  };

  // Usage example
  const { totalShares, averagePrice } = await calculateAggregateData(userId, stockSymbol);
  // Calculate total value, current gains, and current gains percentage
  const totalValue = totalShares * currentPrice;
  const currentGains = (currentPrice - averagePrice) * totalShares;
  const currentGainsPercentage = ((currentPrice - averagePrice) / averagePrice) * 100;

  // Check if the stock already exists for the user in the user_stocks table
  const existingStock = await db("user_stocks")
    .where({ user_id: userId, stock_symbol: stockSymbol })
    .first();

  if (existingStock) {
    // Update the existing record
    await db("user_stocks").where({ id: existingStock.id }).update({
      numberofshares: totalShares,
      average_price: averagePrice,
      current_price: currentPrice,
      total_value: totalValue,
      current_gains: currentGains,
      current_gains_percentage: currentGainsPercentage,
      company_name: companyName,
    });
  } else {
    // Insert a new record if it doesn't exist
    await db("user_stocks").insert({
      user_id: userId,
      stock_symbol: stockSymbol,
      numberofshares: totalShares,
      average_price: averagePrice,
      current_price: currentPrice,
      total_value: totalValue,
      current_gains: currentGains,
      current_gains_percentage: currentGainsPercentage,
      company_name: companyName,
    });
  }
}

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
      "total_value",
      "current_gains",
      "current_gains_percentage"
    );
};

async function fetchCurrentStockPrice(stockSymbol) {
  const API_URL = `https://cloud.iexapis.com/stable/stock/${stockSymbol}/quote`;
  const API_TOKEN = process.env.IEX_CLOUD_API_KEY; // Make sure this environment variable is correctly set
  try {
    const response = await axios.get(`${API_URL}?token=${API_TOKEN}`);
    const stockData = response.data;
    // Return an object containing both latestPrice and companyName
    return {
      currentPrice: stockData.latestPrice,
      companyName: stockData.companyName,
    };
  } catch (error) {
    console.error("Error fetching current stock price:", error);
    throw new Error("Failed to fetch stock price");
  }
}

// Function to delete a purchase and update stock information
export const deletePurchaseAndUpdateStock = async (purchaseId, userId) => {
  try {
    await db.transaction(async (trx) => {
      // Step 1: Delete the purchase and fetch its details before deletion
      const purchaseToDelete = await trx("purchases")
        .where({ id: purchaseId, user_id: userId })
        .first();

      if (!purchaseToDelete) {
        throw new Error("Purchase not found");
      }

      await trx("purchases").where({ id: purchaseId }).del();

      // Step 2: Recalculate the user's stock information
      const remainingPurchases = await trx("purchases").where({
        user_id: userId,
        stock_symbol: purchaseToDelete.stock_symbol,
      });

      let totalShares = 0;
      let totalInvestedAmount = 0;
      remainingPurchases.forEach((purchase) => {
        totalShares += purchase.number_of_stocks_purchased;
        totalInvestedAmount += purchase.number_of_stocks_purchased * purchase.purchase_price;
      });

      const averagePrice = totalShares > 0 ? totalInvestedAmount / totalShares : 0;
      const { currentPrice, companyName } = await fetchCurrentStockPrice(
        purchaseToDelete.stock_symbol
      );
      const totalValue = totalShares * currentPrice;
      const currentGains = totalShares * (currentPrice - averagePrice);
      const currentGainsPercentage = (currentGains / (averagePrice * totalShares)) * 100;

      // Step 3: Update, Insert, or Delete the user's stock information
      const existingUserStock = await trx("user_stocks")
        .where({ user_id: userId, stock_symbol: purchaseToDelete.stock_symbol })
        .first();

      if (totalShares === 0) {
        // If there are no remaining shares, delete the stock record if it exists
        if (existingUserStock) {
          await trx("user_stocks").where({ id: existingUserStock.id }).del();
        }
      } else {
        // Update or insert the stock information
        if (existingUserStock) {
          await trx("user_stocks").where({ id: existingUserStock.id }).update({
            numberofshares: totalShares,
            average_price: averagePrice,
            current_price: currentPrice,
            total_value: totalValue,
            current_gains: currentGains,
            current_gains_percentage: currentGainsPercentage,
            company_name: companyName,
          });
        } else {
          await trx("user_stocks").insert({
            user_id: userId,
            stock_symbol: purchaseToDelete.stock_symbol,
            numberofshares: totalShares,
            average_price: averagePrice,
            current_price: currentPrice,
            total_value: totalValue,
            current_gains: currentGains,
            current_gains_percentage: currentGainsPercentage,
            company_name: companyName,
          });
        }
      }
    });
    console.log("Purchase deleted and stock information updated successfully.");
  } catch (error) {
    console.error("Transaction error:", error);
    throw error; // Rethrow or handle as needed
  }
};

export const editPurchaseAndUpdateStock = async (purchaseId, userId, updatedDetails) => {
  const { number_of_stocks_purchased, purchase_price, purchase_date } = updatedDetails;

  return db.transaction(async (trx) => {
    // Step 1: Update the purchase
    const [updatedPurchase] = await trx("purchases")
      .where({ id: purchaseId, user_id: userId })
      .update(
        {
          number_of_stocks_purchased,
          purchase_price,
          purchase_date,
        },
        ["*"]
      );

    if (!updatedPurchase) {
      throw new Error("Purchase not found");
    }

    // Step 2: Recalculate the stock information
    const purchases = await trx("purchases").where({
      user_id: userId,
      stock_symbol: updatedPurchase.stock_symbol,
    });

    let totalShares = 0;
    let totalInvestedAmount = 0;
    purchases.forEach((purchase) => {
      totalShares += purchase.number_of_stocks_purchased;
      totalInvestedAmount += purchase.number_of_stocks_purchased * purchase.purchase_price;
    });

    const averagePrice = totalShares > 0 ? totalInvestedAmount / totalShares : 0;
    const { currentPrice, companyName } = await fetchCurrentStockPrice(
      updatedPurchase.stock_symbol
    );
    const totalValue = totalShares * currentPrice;
    const currentGains = totalShares * (currentPrice - averagePrice);
    const currentGainsPercentage = (currentGains / (averagePrice * totalShares)) * 100;

    // Step 3: Update the user's stock information
    const userStock = await trx("user_stocks")
      .where({ user_id: userId, stock_symbol: updatedPurchase.stock_symbol })
      .first();

    if (userStock) {
      await trx("user_stocks").where({ id: userStock.id }).update({
        numberofshares: totalShares,
        average_price: averagePrice,
        current_price: currentPrice,
        total_value: totalValue,
        current_gains: currentGains,
        current_gains_percentage: currentGainsPercentage,
        company_name: companyName,
      });
    } else if (totalShares > 0) {
      await trx("user_stocks").insert({
        user_id: userId,
        stock_symbol: updatedPurchase.stock_symbol,
        numberofshares: totalShares,
        average_price: averagePrice,
        current_price: currentPrice,
        total_value: totalValue,
        current_gains: currentGains,
        current_gains_percentage: currentGainsPercentage,
        company_name: companyName,
      });
    } else {
      // If after the update there are no shares left, remove the stock record if it exists
      if (userStock) {
        await trx("user_stocks").where({ id: userStock.id }).del();
      }
    }
  });
};