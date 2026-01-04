const multer = require("multer");
const path = require("path");

/**
 * Configuration du stockage
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/rooms");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

/**
 * Filtrage des fichiers (images uniquement)
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Type de fichier non autorisé"), false);
  } else {
    cb(null, true);
  }
};

/**
 * Limites de sécurité
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2 MB
  }
});

module.exports = upload;
