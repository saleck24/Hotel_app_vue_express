const bd = require("../bd/bd"); // Assure-toi que bd est bd.promise() pour utiliser await

const Reservation = {
  // Créer une réservation
  create: (data) => {
    const sql = `
      INSERT INTO reservations
      (utilisateur_id, chambre_id, date_debut, date_fin, total, statut)
      VALUES (?, ?, ?, ?, ?, 'EN_ATTENTE')
    `;
    return bd.query(sql, [
      data.utilisateur_id,
      data.chambre_id,
      data.date_debut,
      data.date_fin,
      data.total,
    ]); // renvoie une promesse
  },

  // Récupérer toutes les réservations d'un utilisateur
  findByUser: (userId) => {
    const sql = `
      SELECT r.*, ro.numero, ro.type
      FROM reservations r
      JOIN rooms ro ON ro.id = r.chambre_id
      WHERE r.utilisateur_id = ?
      ORDER BY r.created_at DESC
    `;
    return bd.query(sql, [userId]);
  },

  // Récupérer toutes les réservations en attente
  findAllPending: () => {
    const sql = `
      SELECT r.*, u.nom, ro.numero
      FROM reservations r
      JOIN users u ON u.id = r.utilisateur_id
      JOIN rooms ro ON ro.id = r.chambre_id
      WHERE r.statut = 'EN_ATTENTE'
      ORDER BY r.created_at DESC
    `;
    return bd.query(sql);
  },

  // Mettre à jour le statut d'une réservation
  updateStatut: (id, statut) => {
    const sql = "UPDATE reservations SET statut = ? WHERE id = ?";
    return bd.query(sql, [statut, id]);
  },

  // Vérifier les conflits de réservation
  findConflicts: (chambre_id, date_debut, date_fin) => {
    const sql = `
      SELECT *
      FROM reservations
      WHERE chambre_id = ?
        AND statut IN ('EN_ATTENTE','CONFIRMEE')
        AND NOT (date_fin <= ? OR date_debut >= ?)
    `;
    return bd.query(sql, [chambre_id, date_debut, date_fin]);
  },

  // Mettre à jour le statut d'une réservation pour un utilisateur donné
  updateStatutByUser: (id, userId, statut) => {
    const sql = "UPDATE reservations SET statut = ? WHERE id = ? AND utilisateur_id = ?";
    return bd.query(sql, [statut, id, userId]);
  },
  getById: (id) => {
    const sql = `
      SELECT *
      FROM reservations
      WHERE id = ?
      LIMIT 1
    `;
    return bd.query(sql, [id]);
  },
};

module.exports = Reservation;
