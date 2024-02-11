// routes/stocksRoute.js
import { verifytoken } from "../middlewares/verifyToken.js";
import express from "express";
import { addStockToPortfolio, getStockPortfolio } from "../controllers/stocksController.js";;

const stocksRouter = express.Router();

stocksRouter.post("/portfolio", verifytoken, addStockToPortfolio); 
stocksRouter.get("/portfolio/:userId", verifytoken, getStockPortfolio);

export default stocksRouter;
