import dotenv from "dotenv";

dotenv.config({ quiet: true });

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseList = (value) =>
  value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];

const defaultPort = 3000;

export const ENV = {
  PORT: parseNumber(process.env.PORT, defaultPort),
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  CLIENT_URL: process.env.CLIENT_URL,
  CLIENT_URLS: parseList(process.env.CLIENT_URL ?? process.env.CLIENT_URLS),
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
};

// Log critical configuration at startup (mask sensitive values)
console.log("🔧 Environment Configuration:");
console.log(`  NODE_ENV: ${ENV.NODE_ENV}`);
console.log(`  PORT: ${ENV.PORT}`);
console.log(`  DB_URL: ${ENV.DB_URL ? "✅ Set" : "❌ Missing"}`);
console.log(`  CLIENT_URL: ${ENV.CLIENT_URL || "Not set"}`);
console.log(`  STREAM_API_KEY: ${ENV.STREAM_API_KEY ? "✅ Set" : "❌ Missing"}`);
console.log(`  INNGEST_EVENT_KEY: ${ENV.INNGEST_EVENT_KEY ? "✅ Set" : "❌ Missing"}`);
