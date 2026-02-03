const Room = require("../models/rooms.model");
const path = require("path");

const formatRoom = (room) => {
  const baseUrl = "http://localhost:3000/uploads/rooms/";
  const images = [];

  const processImagePath = (rawPath) => {
    if (!rawPath) return null;
    // Extraire le nom de fichier des chemins absolus ou sous-répertoires potentiels
    return path.basename(rawPath);
  };

  if (room.image1) images.push(baseUrl + processImagePath(room.image1));
  if (room.image2) images.push(baseUrl + processImagePath(room.image2));
  if (room.image3) images.push(baseUrl + processImagePath(room.image3));

  return {
    ...room,
    images: images.length > 0 ? images : ["https://placehold.co/600x400?text=Room"]
  };
};

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
      image1: images[0]?.filename || null,
      image2: images[1]?.filename || null,
      image3: images[2]?.filename || null
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
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit) || 3;

  try {
    let rows;
    // Si pas de pagination demandée, retourner toutes les chambres
    if (!page) {
      [rows] = await Room.findAllWithoutLimit();
    } else {
      const offset = (page - 1) * limit;
      [rows] = await Room.findAll(limit, offset);
    }

    const formattedRooms = rows.map(formatRoom);
    res.json(formattedRooms);
  } catch (err) {
    console.error("Erreur récupération chambres :", err);
    res.status(500).json({ message: "Erreur récupération chambres", error: err.message });
  }
};


// Récupérer une chambre par ID
exports.getRoomById = async (req, res) => {
  try {
    const [rows] = await Room.findById(req.params.id);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Chambre non trouvée" });
    }
    res.json(formatRoom(rows[0]));
  } catch (err) {
    console.error("Erreur récupération chambre :", err);
    res.status(500).json({ message: "Erreur récupération chambre", error: err });
  }
};

// Mettre à jour une chambre
exports.updateRoom = async (req, res) => {
  try {
    // Récupérer d'abord la chambre existante pour préserver les images
    const [existingRooms] = await Room.findById(req.params.id);
    if (!existingRooms || existingRooms.length === 0) {
      return res.status(404).json({ message: "Chambre non trouvée" });
    }

    const existingRoom = existingRooms[0];

    const images = req.files || [];
    const roomData = {
      numero: req.body.numero,
      type: req.body.type,
      prix: req.body.prix,
      capacite: req.body.capacite,
      statut: req.body.statut,
      description: req.body.description,
      // Préserver les images existantes si aucune nouvelle image n'est fournie
      image1: images[0]?.filename || req.body.image1 || existingRoom.image1,
      image2: images[1]?.filename || req.body.image2 || existingRoom.image2,
      image3: images[2]?.filename || req.body.image3 || existingRoom.image3
    };

    await Room.update(req.params.id, roomData);
    res.json({ message: "Chambre modifiée" });
  } catch (err) {
    console.error("Erreur modification chambre :", err);
    res.status(500).json({ message: "Erreur modification chambre", error: err.message });
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
