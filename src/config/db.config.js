// const mysql = require("mysql2");

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",  // default in XAMPP
//   password: "",  // keep empty if not set
//   database: "office_management"
// });

// module.exports = db;

const mysql = require("mysql2/promise"); // Use promise-based API for async/await

const connectDB = async () => {
  console.log("Inside MySQL connection function", process.env.DB_URI);
  try {
    // Create the connection pool
    const pool = mysql.createPool({
      uri: process.env.DB_URI, // Use DB_URI from .env (e.g., mysql://root:@localhost:3306/office_management)
      waitForConnections: true,
      connectionLimit: 10, // Adjust as needed
      queueLimit: 0,
    });

    // Test the connection by getting a connection from the pool
    const connection = await pool.getConnection();
    console.log(`✅ MySQL connected successfully to host: ${connection.config.host}`);
    connection.release(); // Release the connection back to the pool

    return pool; // Return the pool for use in other parts of the app
  } catch (error) {
    console.error("❌ MySQL connection error:", error.message);
    process.exit(1); // Exit the process on connection failure
  }
};

module.exports = connectDB;