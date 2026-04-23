import "dotenv/config";
import express from "express";
import cors from "cors";
import { customersRouter } from "./routes/customers";
import { subscriptionsRouter } from "./routes/subscriptions";
import { checkoutRouter } from "./routes/checkout";
import { webhooksRouter } from "./routes/webhooks";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// Webhooks need raw body for signature verification — must be before json middleware
app.use("/api/webhooks", webhooksRouter);

app.use(express.json());
app.use("/api/customers", customersRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/checkout", checkoutRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
