// server.js or index.js
// Importing necessary modules
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/usersRoute.js";
import stocksRouter from "./routes/stocksRoute.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Configuring dotenv to manage environment variables
dotenv.config();

// Creating an instance of express
const app = express();

//MY
// const corsOptions = {
//   origin: 'http://localhost:3000', // Adjust to your frontend's URL
//   credentials: true, // This is important for cookies or Authorization headers
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// if (process.env.NODE_ENV !== "production") {
//   const corsOptions = {
//     origin: "http://localhost:3000",
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   };
//   app.use(cors(corsOptions));
// }

// app.use(cors());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001" // Only allow localhost in development
        : "https://aw-app.onrender.com/", // Your production domain
    credentials: true, // Credentials are needed for session cookies if used
  })
);

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Defining a simple route for the root URL "/"
app.get("/", (req, res) => {
  // Sending a response to the client
  res.send("Hello from the server! This is your Node.js application responding.");
});

// AFTER all your API routes

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "../frontend/build")));

// The "catchall" handler: for any request that doesn't
// match an API route, send back the frontend's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// git add .
// git  commit -m"Resolving base url issues"
// git push
