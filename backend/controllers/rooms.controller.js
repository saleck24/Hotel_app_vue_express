const Room = require("../models/rooms.model");

// Créer une chambre
exports.createRoom = async (req, res) => {
  try {
    const images = req.files || [];
    const roomData = {
      numero: req.body.numero,
      type: req.body.type,
      prix: req.body.prix,
      capacite: req.body.capacite,
      statut: req.body.statut || "DISPONIBLE",
      description: req.body.description,
      image1: images[0]?.path || null,
      image2: images[1]?.path || null,
      image3: images[2]?.path || null
    };

    const result = await Room.create(roomData);
    res.status(201).json({ message: "Chambre ajoutée", roomId: result.insertId });
  } catch (err) {
    console.error("Erreur création chambre :", err);
    res.status(500).json({ message: "Erreur création chambre", error: err });
  }
};

// Récupérer toutes les chambres
exports.getRooms = async (req, res) => {
  console.log("GET /api/rooms appelé");
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await Room.findAll(limit, offset); // destructuring promise
    console.log("Résultat MySQL :", rows);
    res.json(rows);
  } catch (err) {
    console.error("Erreur récupération chambres :", err);
    res.status(500).json({ message: "Erreur récupération chambres", error: err.message });
  }
};


// Récupérer une chambre par ID
exports.getRoomById = async (req, res) => {
  try {
    const rows = await Room.findById(req.params.id);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Chambre non trouvée" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Erreur récupération chambre :", err);
    res.status(500).json({ message: "Erreur récupération chambre", error: err });
  }
};

// Mettre à jour une chambre
exports.updateRoom = async (req, res) => {
  try {
    const images = req.files || [];
    const roomData = {
      numero: req.body.numero,
      type: req.body.type,
      prix: req.body.prix,
      capacite: req.body.capacite,
      statut: req.body.statut,
      description: req.body.description,
      image1: images[0]?.path || req.body.image1,
      image2: images[1]?.path || req.body.image2,
      image3: images[2]?.path || req.body.image3
    };

    await Room.update(req.params.id, roomData);
    res.json({ message: "Chambre modifiée" });
  } catch (err) {
    console.error("Erreur modification chambre :", err);
    res.status(500).json({ message: "Erreur modification chambre", error: err });
  }
};

// Supprimer une chambre
exports.deleteRoom = async (req, res) => {
  try {
    await Room.delete(req.params.id);
    res.json({ message: "Chambre supprimée" });
  } catch (err) {
    console.error("Erreur suppression chambre :", err);
    res.status(500).json({ message: "Erreur suppression chambre", error: err });
  }
};
