const baseUrl = import.meta.env.VITE_ALPACA_BASE_URL;
const key = import.meta.env.VITE_ALPACA_KEY_ID;
const secret = import.meta.env.VITE_ALPACA_SECRET_KEY;

const config = {
  BASE_URL: baseUrl,
  KEY: key,
  SECRET: secret,
};

export default config;
