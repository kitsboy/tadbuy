import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import path from "path";
import rateLimit from "express-rate-limit";
import Joi from "joi";
import { agentAuthMiddleware } from "./src/lib/api/agentAuth.ts";
import { getLightningNodeInfo, createLightningInvoice } from "./src/services/lightningService.ts";
import { FirestoreCampaignRepository } from "./src/lib/db/firestore.ts";
import fs from "fs";
import { jsPDF } from "jspdf";
import admin from "firebase-admin";
import * as Sentry from "@sentry/node";

// Initialize Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

// ... (rest of the file)
import Joi from "joi";

// Campaign validation schema
const campaignSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  budgetSats: Joi.number().positive().required(),
  status: Joi.string().valid('draft', 'live', 'paused', 'completed').required(),
  createdAt: Joi.string().isoDate().required()
});

async function startServer() {
  const app = express();
  const PORT = 3000;
  const campaignRepo = new FirestoreCampaignRepository();

  app.use(express.json());
  app.use(cookieParser());
  app.use(session({
    secret: process.env.SESSION_SECRET || 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'strict' }
  }));

  // Centralized Error Handling
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  // Admin API Routes
  app.post("/api/admin/backup", agentAuthMiddleware('admin'), async (req, res) => {
    try {
      const db = admin.firestore();
      const collections = await db.listCollections();
      const backup: any = {};
      for (const collection of collections) {
        const snapshot = await collection.get();
        backup[collection.id] = snapshot.docs.map(doc => doc.data());
      }
      const backupPath = path.join(process.cwd(), 'backups', `backup-${new Date().toISOString()}.json`);
      if (!fs.existsSync(path.join(process.cwd(), 'backups'))) {
        fs.mkdirSync(path.join(process.cwd(), 'backups'));
      }
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
      res.json({ status: 'success', path: backupPath });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create backup' });
    }
  });

  app.get("/api/metrics", async (req, res) => {
    // Placeholder: Fetch metrics from Firestore
    res.json({
      impressions: 1240000,
      clicks: 14820,
      ctr: 1.2,
      spend: 0.0423,
      trend: [
        { name: 'Mon', impressions: 4000 },
        { name: 'Tue', impressions: 3000 },
        { name: 'Wed', impressions: 5000 },
        { name: 'Thu', impressions: 2780 },
        { name: 'Fri', impressions: 6890 },
        { name: 'Sat', impressions: 4390 },
        { name: 'Sun', impressions: 7490 },
      ]
    });
  });

  // Agent API Routes
  const agentRouter = express.Router();
  agentRouter.use(agentAuthMiddleware('agent'));

  agentRouter.post("/campaigns", async (req, res) => {
    const { error, value } = campaignSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: 'Validation Error', details: error.details });
    }

    try {
      const campaign = await campaignRepo.create(value);
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  });

  agentRouter.get("/metrics", async (req, res) => {
    // Placeholder: Fetch metrics from Firestore
    res.json({ impressions: 1240000, clicks: 14820, spend: 0.0423 });
  });

  agentRouter.post("/topup", async (req, res) => {
    // Placeholder: Trigger Lightning payment
    res.json({ status: "topup_initiated", txid: "tx_123" });
  });

  app.use("/api/agent", agentRouter);

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

  const campaignSchema = Joi.object({
    name: Joi.string().required(),
    budgetSats: Joi.number().positive().required()
  });

  // In-memory storage for settlements
  const settlements: any[] = [];

  // API routes
  app.get("/api/settlements", (req, res) => {
    res.json(settlements);
  });

  app.post("/api/campaigns", async (req, res) => {
    const { error } = campaignSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      const campaign = await campaignRepo.create({
        ...req.body,
        status: 'draft',
        createdAt: new Date().toISOString()
      });
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  });

  app.get("/api/docs/pdf", (req, res) => {
    const doc = new jsPDF();
    const content = fs.readFileSync(path.join(process.cwd(), 'TECHNICAL_DOCUMENTATION.md'), 'utf-8');
    doc.text(content, 10, 10);
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Tadbuy_Documentation.pdf');
    res.send(pdfBuffer);
  });

  app.get("/api/lightning/info", async (req, res) => {
    try {
      const info = await getLightningNodeInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ error: 'Failed to connect to Lightning node' });
    }
  });

  app.post("/api/lightning/invoice", async (req, res) => {
    try {
      const { amountSats, description } = req.body;
      const invoice = await createLightningInvoice(amountSats, description);
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create Lightning invoice' });
    }
  });

  app.post("/api/lightning/offer", async (req, res) => {
    // Placeholder for BOLT 12 offer generation
    res.json({ offer: "lnurl1..." });
  });

  app.post("/api/webhooks/lightning", (req, res) => {
    // Placeholder for webhook listener
    console.log("Webhook received:", req.body);
    res.status(200).send("OK");
  });

  app.get("/api/blockchain/info", async (req, res) => {
    try {
      const response = await fetch('https://mempool.space/api/blocks/tip/height');
      const height = await response.text();
      res.json({ height: parseInt(height) });
    } catch (error) {
      // Fallback to a mock height if API fails
      res.json({ height: 840000 });
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

  // Environment Variable Warning
  const requiredEnvVars = ['GEMINI_API_KEY', 'FIREBASE_PROJECT_ID'];
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      console.warn(`Warning: Missing environment variable: ${varName}`);
    }
  });

  // Centralized Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
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
