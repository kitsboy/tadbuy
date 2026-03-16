import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import rateLimit from "express-rate-limit";
import Joi from "joi";
import { getLightningNodeInfo } from "./src/services/lightningService";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
  });

  const settleSchema = Joi.object({
    amount: Joi.number().positive().required(),
    address: Joi.string().alphanum().min(26).max(62).required(),
    paymentType: Joi.string().valid('on-chain', 'lightning').required()
  });

  // In-memory storage for settlements
  const settlements: any[] = [];

  // API routes
  app.get("/api/settlements", (req, res) => {
    res.json(settlements);
  });

  app.get("/api/lightning/info", async (req, res) => {
    try {
      const info = await getLightningNodeInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ error: 'Failed to connect to Lightning node' });
    }
  });

  app.post("/api/settle", limiter, async (req, res) => {
    const { error } = settleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { amount, address, paymentType } = req.body;
    const txid = "tx_" + Math.random().toString(36).substring(2, 15);
    
    if (paymentType === 'lightning') {
      console.log(`Initiating Lightning payment of ${amount} BTC to ${address}`);
    } else {
      console.log(`Broadcasting on-chain transaction of ${amount} BTC to ${address}`);
    }

    const settlement = {
      id: settlements.length + 1,
      amount,
      address,
      txid,
      timestamp: new Date().toISOString(),
      status: "pending",
      paymentType
    };
    settlements.push(settlement);
    res.json({ status: "success", txid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
