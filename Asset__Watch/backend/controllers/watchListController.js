import * as Watchlist from "../models/watchList.model.js";

export const addStockToWatchlist = async (req, res) => {
  try {
    const { userId, symbol } = req.body;
    const item = await Watchlist.addToWatchlist(userId, symbol);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
};

export const getWatchlistForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const watchlist = await Watchlist.getWatchlist(userId);
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve watchlist" });
  }
};

export const removeStockFromWatchlist = async (req, res) => {
  try {
    const { userId, symbol } = req.body;
    const response = await Watchlist.removeFromWatchlist(userId, symbol);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from watchlist" });
  }
};
