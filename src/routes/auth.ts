import { Router } from "express";
import { registerUser, loginUser, getProfile } from "../controllers/auth";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);

export default router;
