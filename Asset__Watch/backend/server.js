// server.js or index.js
// Importing necessary modules
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/usersRoute.js";
import stocksRouter from "./routes/stocksRoute.js";
import cookieParser from "cookie-parser";

// Configuring dotenv to manage environment variables
dotenv.config();

// Creating an instance of express
const app = express();

// Using cors for cross-origin resource sharing
// app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost:3000", // Replace with your frontend's origin
//     credentials: true, // Required if your frontend needs to send cookies or authorization headers
//   })
// );

const corsOptions = {
  origin: 'http://localhost:3000', // Adjust to your frontend's URL
  credentials: true, // This is important for cookies or Authorization headers
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Using cookieParser
app.use(cookieParser());

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing JSON bodies
app.use(express.json());

// Getting the port number from the environment variables or defaulting to 3001
const port = process.env.PORT || 3001;

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Using the usersRouter for routes starting with "/users"
app.use("/users", usersRouter);
// Use the portfolio routes
app.use("/api", stocksRouter);

// Defining a simple route for the root URL "/"
app.get("/", (req, res) => {
  // Sending a response to the client
  res.send("Hello from the server! This is your Node.js application responding.");
});