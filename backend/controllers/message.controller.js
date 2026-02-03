const Message = require("../models/message.model");

// Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { to_user_id, message } = req.body;

    if (!message || !to_user_id) {
      return res.status(400).json({ message: "Message ou destinataire manquant" });
    }

    const data = {
      from_user_id: req.user.id,
      to_user_id,
      message,
    };

    const [result] = await Message.create(data);

    res.status(201).json({ message: "Message envoyé", id: result.insertId });

  } catch (err) {
    console.error("Erreur sendMessage :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer l'historique avec un autre utilisateur
exports.getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const [rows] = await Message.findByUsers(req.user.id, otherUserId);

    res.status(200).json(rows);

  } catch (err) {
    console.error("Erreur getMessages :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer la liste des conversations
exports.getConversations = async (req, res) => {
  try {
    const rows = await Message.getConversations(req.user.id);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur getConversations :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
