import "dotenv/config";
import crypto from "crypto";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import * as db from "../db";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // PayKeeper sends a server-to-server POST after every successful payment.
  // The signature, order amount and participant identity are all checked before an
  // application is marked paid. A repeated verified notification remains idempotent.
  app.post("/api/paykeeper/notification", async (req, res) => {
    const secret = process.env.PAYKEEPER_NOTIFICATION_SECRET;
    const { id, sum, clientid, orderid, key } = req.body as Record<string, string | undefined>;

    if (!secret || !id || !sum || !orderid || !key) {
      return res.status(400).send("Error! Missing payment notification data");
    }

    const verification = await db.getPaymentVerificationData(orderid);
    if (!verification || !verification.application) {
      return res.status(404).send("Error! Order not found");
    }

    const amount = Number(sum);
    const expectedAmount = verification.transaction.amount;
    const expectedClientId = verification.application.participantName;
    const normalizedSum = amount.toFixed(2);
    const expectedKey = crypto
      .createHash("md5")
      .update(`${id}${normalizedSum}${clientid || ""}${orderid}${secret}`)
      .digest("hex");

    const isSignatureValid =
      key.length === expectedKey.length &&
      crypto.timingSafeEqual(Buffer.from(key), Buffer.from(expectedKey));
    const isAmountValid = Number.isFinite(amount) && Math.abs(amount - expectedAmount) < 0.001;
    const isClientValid = !clientid || clientid === expectedClientId;

    if (!isSignatureValid || !isAmountValid || !isClientValid) {
      console.warn("[PayKeeper] Rejected notification", {
        orderid,
        isSignatureValid,
        isAmountValid,
        isClientValid,
      });
      return res.status(400).send("Error! Payment verification failed");
    }

    await db.updatePaymentTransaction(orderid, "paid", JSON.stringify(req.body));
    const acknowledgement = crypto.createHash("md5").update(`${id}${secret}`).digest("hex");
    return res.type("text/plain").send(`OK ${acknowledgement}`);
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
