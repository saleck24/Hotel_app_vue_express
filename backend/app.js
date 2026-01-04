require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: "Trop de requêtes, veuillez réessayer plus tard"
});

app.use("/api", apiLimiter);

// Route racine
app.get("/", (req, res) => {
  res.send("Backend Hotel App is running 🚀");
});

// Route bd
const bdTestRoutes = require("./routes/bdTest.routes");
app.use("/api", bdTestRoutes);

// Route users
const usersRoutes = require("./routes/users.routes");
app.use("/api", usersRoutes);

// Route Chambre
const roomRoutes = require("./routes/rooms.routes");
app.use("/api/rooms", roomRoutes);
app.use("/uploads", express.static("uploads"));

//Route Réservation
const reservationRoutes = require("./routes/reservation.routes");
app.use("/api/reservations", reservationRoutes);

// Route Message
const messageRoutes = require("./routes/message.routes");
app.use("/api/messages", messageRoutes);

//Route Review
const reviewRoutes = require("./routes/review.routes");
app.use("/api/reviews", reviewRoutes);


// Swagger
const setupSwagger = require("./swagger");
setupSwagger(app);

module.exports = app;
