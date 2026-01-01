require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());




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


// Swagger
const setupSwagger = require("./swagger");
setupSwagger(app);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Swagger docs available on http://localhost:3000/api-docs");
});
