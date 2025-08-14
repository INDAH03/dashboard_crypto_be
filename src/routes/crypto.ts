import { Router } from "express";
import { getPrices, getCoinDetail, getCryptoNews, getTopCoins } from "../controllers/crypto";
import cors from "cors";

const router = Router();

router.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET'],
  credentials: true
}));

router.get("/crypto-prices", getPrices);
router.get("/crypto-prices/:id", getCoinDetail);
router.get("/top-coins", getTopCoins);
router.get("/news", getCryptoNews);

export default router;