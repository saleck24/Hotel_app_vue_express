const bd = require("../bd/bd");

const Review = {

  create: (data, callback) => {
    const sql = `
      INSERT INTO reviews
      (reservation_id, utilisateur_id, chambre_id, note, commentaire, date_review)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    bd.query(
      sql,
      [
        data.reservation_id,
        data.utilisateur_id,
        data.chambre_id,
        data.note,
        data.commentaire
      ],
      callback
    );
  },

  findByRoom: (roomId, callback) => {
    const sql = `
      SELECT r.*, u.username
      FROM reviews r
      JOIN users u ON u.id = r.utilisateur_id
      WHERE r.chambre_id = ?
      ORDER BY r.date_review DESC
    `;
    bd.query(sql, [roomId], callback);
  },

  findByUser: (userId) => {
    return bd.query(
      `SELECT r.*, ro.numero
     FROM reviews r
     JOIN rooms ro ON ro.id = r.chambre_id
     WHERE r.utilisateur_id = ?
     ORDER BY r.date_review DESC`,
      [userId]
    );
  },

  getByRoomId: (roomId) => {
    return bd.query(
      `SELECT r.id, r.note, r.commentaire, r.date_review,
              u.nom AS utilisateur, ro.numero AS chambre_numero
      FROM reviews r
      JOIN users u ON u.id = r.utilisateur_id
      JOIN rooms ro ON ro.id = r.chambre_id
      WHERE r.chambre_id = ?
      ORDER BY r.date_review DESC`,
      [roomId]
    );
  },

  findAll: () => {
    return bd.query(
      `SELECT r.id, r.note, r.commentaire, r.date_review,
              u.nom AS utilisateur, ro.numero AS chambre_numero, ro.type AS chambre_type
      FROM reviews r
      JOIN users u ON u.id = r.utilisateur_id
      JOIN rooms ro ON ro.id = r.chambre_id
      ORDER BY r.date_review DESC`
    );
  },
};

module.exports = Review;
