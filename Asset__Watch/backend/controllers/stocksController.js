// controllers/stocksController.js

import axios from "axios";
import { addUserStock, getUserStocks } from "../models/stocks.model.js";

const IEX_CLOUD_API_KEY = process.env.IEX_CLOUD_API_KEY;
const IEX_BASE_URL = "https://cloud.iexapis.com/stable";

export const addStockToPortfolio = async (req, res) => {
  // Destructure your request body; remember to adjust according to the form data names if different
  const { stockSymbol, numberofshares, averagePrice, purchase_date } = req.body;
  const userId = req.user.id; // Ensure that this correctly references the decoded JWT payload where userId is stored

  // Validate presence of required data
  if (!stockSymbol || !numberofshares || !averagePrice || !purchase_date) {
    return res.status(400).json({
      message: "Stock symbol, number of shares, average price, and purchase date are required.",
    });
  }

  try {
    // Fetch stock data from IEX Cloud
    const stockDataResponse = await axios.get(
      `${IEX_BASE_URL}/stock/${stockSymbol}/quote?token=${IEX_CLOUD_API_KEY}`
    );
    const stockData = stockDataResponse.data;

    // Call the updated addUserStock with the new field names
    const updateResult = await addUserStock(userId, stockSymbol, numberofshares, averagePrice, {
      latestPrice: stockData.latestPrice,
      companyName: stockData.companyName,
      purchase_date: purchase_date, // Include the purchase_date field in the additionalData object
    });

    res.json({ message: "Stock added to portfolio", stockData, updateResult });
  } catch (error) {
    console.error("Error while adding stock to portfolio:", error);
    res.status(500).json({ message: "Error adding stock to portfolio", error: error.message });
  }
};

export const getStockPortfolio = async (req, res) => {
  const { userId } = req.params;
  try {
    const stocks = await getUserStocks(userId);

    // Optional: Fetch real-time data for each stock in the portfolio from IEX Cloud
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const url = `${IEX_BASE_URL}/stock/${stock.stock_symbol}/quote?token=${IEX_CLOUD_API_KEY}`;
        // console.log("Fetching data from IEX Cloud:", url);
        const stockDataResponse = await axios.get(url);
        return { ...stock, ...stockDataResponse.data };
      })
    );

    res.json(updatedStocks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving stock portfolio", error: error.message });
  }
};
