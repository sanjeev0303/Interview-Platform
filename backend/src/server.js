import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();

const __dirname = path.resolve();

// middleware
app.use(express.json());
// credentials:true meaning?? => server allows a browser to include cookies on request
const allowedOrigins = ENV.CLIENT_URLS?.length
  ? ENV.CLIENT_URLS
  : ENV.CLIENT_URL
    ? [ENV.CLIENT_URL]
    : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
  console.log("🔍 Health check requested");
  res.status(200).json({
    status: "ok",
    message: "api is up and running",
    timestamp: new Date().toISOString(),
    port: ENV.PORT,
    nodeEnv: ENV.NODE_ENV
  });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");

  // Serve static files (CSS, JS, images, fonts, etc.) with proper headers
  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Set proper MIME types for assets
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  }));

  // Catch-all route: serve React app for any non-API routes
  app.use((req, res, next) => {
    // Skip if it's an API route or a static asset
    if (req.path.startsWith('/api') || req.path.includes('.')) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    // Bind to 0.0.0.0 to accept external connections in containerized/cloud environments
    const HOST = "0.0.0.0";
    app.listen(ENV.PORT, HOST, () => {
      console.log(`✅ Server is running on ${HOST}:${ENV.PORT}`);
      console.log(`📍 Health check available at http://${HOST}:${ENV.PORT}/health`);
    });
  } catch (error) {
    console.error("💥 Error starting the server", error);
    process.exit(1);
  }
};

startServer();
