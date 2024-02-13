// routes/stocksRoute.js
import { verifytoken } from "../middlewares/verifyToken.js";
import express from "express";
import { addStockToPortfolio, getStockPortfolio, getPurchasesByUser, deletePurchase, editPurchase, } from "../controllers/stocksController.js";


const stocksRouter = express.Router();

stocksRouter.post("/portfolio", verifytoken, addStockToPortfolio);
stocksRouter.get("/portfolio/:userId", verifytoken, getStockPortfolio);

stocksRouter.delete("/purchases/:purchaseId", verifytoken, deletePurchase);
stocksRouter.put("/purchase/:purchaseId", verifytoken, editPurchase);
stocksRouter.get("/purchases/:userId", verifytoken, getPurchasesByUser);



export default stocksRouter;
