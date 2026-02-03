const Review = require("../models/review.model");
const Reservation = require("../models/reservation.model");

// ==========================
// CREATE REVIEW
// ==========================
exports.createReview = async (req, res) => {
  try {
    const { reservation_id, note, commentaire } = req.body;
    const utilisateur_id = req.user.id;

    const [rows] = await Reservation.getById(reservation_id);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    const reservation = rows[0];

    if (reservation.statut !== "CONFIRMEE") {
      return res.status(400).json({
        message: "Vous ne pouvez pas laisser de feedback avant la confirmation",
      });
    }

    if (reservation.utilisateur_id !== utilisateur_id) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await Review.create({
      reservation_id,
      utilisateur_id,
      chambre_id: reservation.chambre_id,
      note,
      commentaire,
    });

    res.status(201).json({ message: "Feedback enregistré avec succès" });

  } catch (err) {
    console.error("Erreur createReview :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ==========================
// GET REVIEWS BY ROOM
// ==========================
exports.getReviewsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const [reviews] = await Review.getByRoomId(roomId);

    res.status(200).json(reviews);

  } catch (err) {
    console.error("Erreur getReviewsByRoom :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getReviewsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const [reviews] = await Review.findByUser(userId);
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Erreur getReviewsByUser :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const [reviews] = await Review.findAll();
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Erreur getAllReviews :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

