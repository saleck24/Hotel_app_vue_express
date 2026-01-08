const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Configuration du stockage
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/rooms");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});*/

/**
 * Factory Multer
 * @param {string} folder - dossier cible (rooms, profiles)
 */
const createUploader = (folder) => {
  const uploadDir = path.join(__dirname, "..", "uploads", folder);

  // Crée le dossier s'il n'existe pas
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
   const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

  // Filtrage des fichiers (images uniquement)
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/jfif"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Type de fichier non autorisé"), false);
    } else {
      cb(null, true);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 2MB
    },
  });
};

module.exports = createUploader;