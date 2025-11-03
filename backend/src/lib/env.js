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
