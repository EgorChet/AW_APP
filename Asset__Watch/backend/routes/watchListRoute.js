
import express from "express";
import * as watchlistController from "../controllers/watchListController.js";

const watchListRouter = express.Router();

watchListRouter.post("/", watchlistController.addStockToWatchlist);
watchListRouter.get("/:userId", watchlistController.getWatchlistForUser);
watchListRouter.delete("/", watchlistController.removeStockFromWatchlist);

export default watchListRouter;
