// controllers/stocksController.js
import axios from "axios";
import {
  addUserStock,
  getUserStocks,
  editPurchaseAndUpdateStock,
  deletePurchaseAndUpdateStock,
} from "../models/stocks.model.js";
import { db } from "../config/db.js";

const IEX_CLOUD_API_KEY = process.env.IEX_CLOUD_API_KEY;
const IEX_BASE_URL = "https://cloud.iexapis.com/stable";

// Controller to handle adding a stock to the user's portfolio
export const addStockToPortfolio = async (req, res) => {
  // Extract relevant information from the request body
  console.log(req.body); // Log the request body at the beginning of the addStockToPortfolio function.
  const userId = req.user.id; // Assuming you have middleware to authenticate and add the user object
  const { stockSymbol, numberofshares, purchasePrice, purchase_date } = req.body;
  console.log("I am still here");
  // Validate the request body for necessary information
  if (!stockSymbol || !numberofshares || !purchasePrice || !purchase_date) {
    return res.status(400).json({
      message:
        "Missing required information. stockSymbol, numberofshares, purchasePrice and purchase_date are required.",
    });
  }

  try {
    // Add the user stock to the portfolio
    await addUserStock(userId, stockSymbol, numberofshares, purchasePrice, purchase_date);

    // If successful, send a response back
    res.status(200).json({
      message: "Stock successfully added to portfolio.",
    });
  } catch (error) {
    // Handle any errors
    console.error("Error adding stock to portfolio:", error);
    res.status(500).json({
      message: "An error occurred while adding the stock to the portfolio.",
      error: error.message,
    });
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

export const getPurchasesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const purchases = await db("purchases").where({ user_id: userId }).select("*");
    res.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};

export const editPurchase = async (req, res) => {
  const purchaseId = req.params.purchaseId; // Correctly extracting purchaseId from the route parameter
  const userId = req.user.id; // Extracted from req.user, assuming your authentication middleware adds it
  const { number_of_stocks_purchased, purchase_price, purchase_date } = req.body;

  try {
    // Pass the extracted parameters to the model function
    const updatedPurchase = await editPurchaseAndUpdateStock(
      purchaseId,
      userId,
      { number_of_stocks_purchased, purchase_price, purchase_date }
    );

    // Respond with the updated purchase or a success message
    res.json({ message: "Purchase updated and stock information recalculated successfully.", updatedPurchase });
  } catch (error) {
    console.error("Error updating purchase and recalculating stock information:", error);
    res.status(500).json({
      message: "Failed to update purchase and recalculate stock information",
      error: error.message,
    });
  }
};

export const deletePurchase = async (req, res) => {
  const { purchaseId } = req.params; // Ensure your route parameter matches this
  const userId = req.user.id; // Assuming your authentication middleware adds `user` to `req`

  try {
    await deletePurchaseAndUpdateStock(purchaseId, userId);
    res.json({ message: "Purchase deleted successfully and portfolio updated." });
  } catch (error) {
    console.error("Error deleting purchase and updating portfolio:", error);
    res
      .status(500)
      .json({ message: "Failed to delete purchase and update portfolio", error: error.message });
  }
};
