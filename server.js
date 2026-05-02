const mongoose = require("mongoose"); // Interact with MongoDB database
const dotenv = require("dotenv"); // Load environment variables from config.env file

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" }); // Set up config file
const app = require("./app"); // Import the Express app

// Connect to the MongoDB database using Mongoose from config.env. Replace the <db_password> placeholder with the actual password from environment variables.
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);
console.log(DB);

// Connect to the database and log a success message if the connection is successful
mongoose.connect(DB).then(() => {
  console.log("DB connected succesfully!");
});

const port = process.env.PORT; // Get the port number from environment variables

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


