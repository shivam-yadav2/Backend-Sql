const dotenv = require("dotenv");
const connectDB = require("./src/config/db.config.js");
const app = require("./src/app.js");
// const { errorHandler } = require("./src/middleware/errorHandler.middelware.js");

dotenv.config({ path: "./.env" });

// app.use(errorHandler);

const startServer = async () => {
  try {
    // Initialize MySQL connection pool
    const dbPool = await connectDB(); // Get the pool from connectDB
    app.set("dbPool", dbPool); // Attach pool to Express app for global access

    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server is running on port ${process.env.PORT}`);
    });

    // Test response at the root endpoint
    app.get("/", (req, res) => {
      res.status(200).json({ message: "Server is up and running!" });
    });
  } catch (err) {
    console.error("❌ Server failed to start", err);
  }
};

startServer();