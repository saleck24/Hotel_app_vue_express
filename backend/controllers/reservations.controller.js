const Reservation = require("../models/reservation.model");
const Room = require("../models/rooms.model");
const bd = require("../bd/bd");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

// Calcul du nombre de nuits entre deux dates
const calculerNuits = (debut, fin) => {
  const d1 = new Date(debut);
  const d2 = new Date(fin);
  const diff = d2 - d1;
  return diff / (1000 * 60 * 60 * 24);
};

// Créer réservation
exports.createReservation = async (req, res) => {
  console.log("➡️ createReservation appelée");

  try {
    const { chambre_id, date_debut, date_fin } = req.body;
    if (!chambre_id || !date_debut || !date_fin)
      return res.status(400).json({ message: "Tous les champs sont requis" });

    const [chambreRows] = await Room.findById(chambre_id);
    if (!chambreRows.length) return res.status(404).json({ message: "Chambre introuvable" });
    const chambre = chambreRows[0];

    const nuits = calculerNuits(date_debut, date_fin);
    if (nuits <= 0) return res.status(400).json({ message: "Dates invalides" });

    const [conflicts] = await Reservation.findConflicts(chambre_id, date_debut, date_fin);
    if (conflicts.length > 0) return res.status(400).json({ message: "Chambre indisponible" });

    const total = nuits * chambre.prix;
    await Reservation.create({ utilisateur_id: req.user.id, chambre_id, date_debut, date_fin, total });

    res.status(201).json({ message: "Réservation en attente", total });

  } catch (err) {
    console.error("Exception createReservation :", err);
    res.status(500).json({ message: "Erreur serveur inattendue", error: err.message });
  }
};

// Récupérer réservations utilisateur
exports.getMyReservations = async (req, res) => {
  try {
    // findByUser retourne une promesse [rows, fields]
    const result = await Reservation.findByUser(req.user.id);
    const rows = result[0]; // prend le premier élément = rows
    res.json(rows);
  } catch (err) {
    console.error("Erreur getMyReservations :", err);
    res.status(500).json({ message: "Erreur récupération réservations" });
  }
};
// Récupérer réservations en attente
exports.getPendingReservations = async (req, res) => {
  try {
    const result = await Reservation.findAllPending(); // result = [rows, fields]
    const rows = result[0]; // récupère juste les données
    res.json(rows);
  } catch (err) {
    console.error("Erreur getPendingReservations :", err);
    res.status(500).json({ message: "Erreur récupération réservations" });
  }
};

// Récupérer TOUTES les réservations (ADMIN)
exports.getAllReservations = async (req, res) => {
  try {
    const [rows] = await Reservation.findAll();
    res.json(rows);
  } catch (err) {
    console.error("Erreur getAllReservations :", err);
    res.status(500).json({ message: "Erreur récupération réservations" });
  }
};

// Annuler réservation par Admin
exports.annulerReservationAdmin = async (req, res) => {
  const reservationId = req.params.id;
  try {
    await Reservation.updateStatut(reservationId, "ANNULEE");
    res.json({ message: "Réservation annulée par l'administrateur" });
  } catch (err) {
    console.error("Erreur annulerReservationAdmin :", err);
    res.status(500).json({ message: "Erreur lors de l'annulation" });
  }
};



exports.validerReservation = async (req, res) => {
  const reservationId = req.params.id;

  try {
    const [results] = await bd.query(
      `SELECT r.*, u.nom AS nom_utilisateur, u.email, ro.numero AS numero_chambre
       FROM reservations r
       JOIN users u ON u.id = r.utilisateur_id
       JOIN rooms ro ON ro.id = r.chambre_id
       WHERE r.id = ?`,
      [reservationId]
    );

    if (!results.length) return res.status(404).json({ message: "Réservation introuvable" });
    const reservation = results[0];

    await Reservation.updateStatut(reservationId, "CONFIRMEE");

    // Update explicitly to OCCUPEE and log it
    console.log(`[Validation] Updating room ${reservation.chambre_id} status to OCCUPEE`);
    await Room.updateStatut(reservation.chambre_id, "OCCUPEE");

    // Générer le PDF dans un Buffer
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Contenu PDF
      doc.fontSize(10).text(`Date réservation : ${new Date().toLocaleDateString()}`, { align: "left" });
      doc.moveDown(20);
      doc.fontSize(20).text("Reçu de réservation", { align: "center" });
      doc.moveDown(5);
      doc.fontSize(14).text(
        `Bonjour ${reservation.nom_utilisateur},\nVous avez réservé la chambre numéro ${reservation.numero_chambre}.\nDu ${reservation.date_debut.toLocaleDateString()} au ${reservation.date_fin.toLocaleDateString()}.\nMontant total : ${reservation.total} MRU.`,
        { align: "center" }
      );

      doc.end();
    });

    // Envoi email
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Hotel App" <${process.env.EMAIL_USER}>`,
        to: reservation.email,
        subject: "Reçu de réservation",
        text: "Bonjour, veuillez trouver votre reçu de réservation en pièce jointe.",
        html: `<p>Bonjour,</p><p>Veuillez trouver votre reçu de réservation en pièce jointe.</p><p>Cordialement,</p><p>Hotel_App</p>`,
        attachments: [
          {
            filename: `Recu_Reservation_${reservation.id}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
    } catch (emailError) {
      console.error("Erreur envoi email :", emailError);
    }

    res.json({ message: "Réservation confirmée (Statut Room mis à jour)" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


exports.annulerReservation = async (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.id;

  try {
    // 1️⃣ Vérifier la réservation
    const [rows] = await bd.query(
      `SELECT r.*, u.nom AS nom_utilisateur, u.email, ro.numero AS numero_chambre
       FROM reservations r
       JOIN users u ON u.id = r.utilisateur_id
       JOIN rooms ro ON ro.id = r.chambre_id
       WHERE r.id = ? AND r.utilisateur_id = ?`,
      [reservationId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Réservation non trouvée ou non autorisée",
      });
    }

    const reservation = rows[0];

    // 2️⃣ Mise à jour du statut
    const [updateResult] = await Reservation.updateStatutByUser(
      reservationId,
      userId,
      "ANNULEE"
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({
        message: "Impossible d'annuler la réservation",
      });
    }

    // 3️⃣ Génération du PDF (await réel)
    const pdfData = await new Promise((resolve) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      doc.fontSize(10).text(`Date d'annulation : ${new Date().toLocaleDateString()}`);
      doc.moveDown(2);
      doc.fontSize(20).text("Confirmation d'annulation de réservation", {
        align: "center",
      });
      doc.moveDown(2);
      doc.fontSize(14).text(
        `Bonjour ${reservation.nom_utilisateur},

Votre réservation pour la chambre numéro ${reservation.numero_chambre}
a été annulée.

Séjour prévu :
Du ${reservation.date_debut.toLocaleDateString()}
au ${reservation.date_fin.toLocaleDateString()}

Montant : ${reservation.total} MRU`,
        { align: "center" }
      );

      doc.end();
    });

    // 4️⃣ Envoi de l’email (await réel)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Hotel App" <${process.env.EMAIL_USER}>`,
      to: reservation.email,
      subject: "Confirmation d'annulation de réservation",
      html: `<p>Bonjour ${reservation.nom_utilisateur},</p>
             <p>Votre réservation a été annulée avec succès.</p>
             <p>Veuillez trouver la confirmation en pièce jointe.</p>`,
      attachments: [
        {
          filename: `Annulation_Reservation_${reservation.id}.pdf`,
          content: pdfData,
        },
      ],
    });

    // 5️⃣ Réponse finale
    res.json({
      message: "Réservation annulée, statut mis à jour et email envoyé avec succès",
    });

  } catch (err) {
    console.error("Erreur annulerReservation :", err);
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};
