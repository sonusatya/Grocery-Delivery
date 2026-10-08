import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import orderRouter from "./routes/orderRoutes.js";


import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import addressRouter from "./routes/addressRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import deliveryPartnerRouter from "./routes/deliveryPartnerRoutes.js";
import { stripeWebhook } from "./controllers/webhooks.js";

const app = express();
app.post("/api/stripe", express.raw({type: 'application/json'}), stripeWebhook)

// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/orders', orderRouter)
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/addresses', addressRouter);
app.use('/api/admin', adminRouter);
app.use('/api/delivery', deliveryPartnerRouter);

//Error handling

app.use((error: any, req: Request, res: Response, next: NextFunction)=>{
  console.error(error)

  // Response already sent (e.g. stream errored) — delegate to Express default handler
  if (res.headersSent) {
    return next(error)
  }

  res.status(500).json({message: error?.message || "Internal server error"})
})

// Keep the server alive if any non-route async code (Inngest, Stripe SDK,
// background promises, etc.) rejects — otherwise Node exits and every
// in-flight request fails with a network error.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason)
})

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error)
  process.exit(1)
})

// On Vercel (serverless) the app is exported instead of listening on a port
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;