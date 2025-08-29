import { Router } from "express";
import { getPrices, getCoinDetail, getCryptoNews, getTopCoins } from "../controllers/crypto";
import { registerUser, loginUser, getProfile, updateProfile } from "../controllers/auth";
import { getOrders, createOrder, cancelOrder } from "../controllers/order";
import { authMiddleware } from "../middleware/authMiddleware";
import cors from "cors";

const router = Router();

// CORS: GET, POST, PUT, PATCH, DELETE
router.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// Crypto routes
router.get("/crypto-prices", getPrices);
router.get("/crypto-prices/:id", getCoinDetail);
router.get("/top-coins", getTopCoins);
router.get("/news", getCryptoNews);

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// orders routes
router.get("/orders", authMiddleware, getOrders);      
router.post("/orders", authMiddleware, createOrder);     
router.patch("/orders/:id/cancel", authMiddleware, cancelOrder); 

export default router;
