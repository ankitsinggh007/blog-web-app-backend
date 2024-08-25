const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const apiRoutes = require("./routes/api");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const corsOptions = {
  origin: [
    `${process.env.url}`, // Production URL
    "http://localhost:5173", // Local development URL
  ],
  methods: "GET,POST,PATCH,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define routes
app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
