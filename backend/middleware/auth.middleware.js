const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer TOKEN"
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient id et role
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Accès réservé à l'admin" });
  }
  next();
};
