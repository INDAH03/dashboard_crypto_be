import express from "express";
import cors from "cors";
import cryptoRoutes from "./routes/crypto";
import authRoutes from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", cryptoRoutes);
app.use("/api/auth", authRoutes);

export default app;
