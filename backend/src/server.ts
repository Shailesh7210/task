import dotenv from "dotenv";
dotenv.config();
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();