import "dotenv/config";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO URI not defined");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT SECRET not defined");
}

if (!process.env.REDIS_HOST) {
  throw new Error(" REDIS HOST not defined");
}

if (!process.env.REDIS_PORT) {
  throw new Error("REDIS PORT not defined");
}

if (!process.env.REDIS_PASSWORD) {
  throw new Error("REDIS PASSWORD not defined");
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error("IMAGEKIT PRIVATE KEY not defined");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE CLIENT ID not defined");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE CLIENT SECRET not defined");
}

if (!process.env.RAZORPAY_SECRET_KEY) {
  throw new Error("RAZORPAY_SECRET_KEY not defined");
}

if (!process.env.RAZORPAY_SECRET_ID) {
  throw new Error("RAZORPAY_SECRET_ID not defined");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  RAZORPAY_SECRET_ID: process.env.RAZORPAY_SECRET_ID,
  RAZORPAY_SECRET_KEY: process.env.RAZORPAY_SECRET_KEY,
};
