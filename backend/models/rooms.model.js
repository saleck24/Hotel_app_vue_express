const bd = require("../bd/bd"); // bd.promise()

const Room = {
  create: (data) => {
    const sql = `
      INSERT INTO rooms
      (numero, type, prix, capacite, statut, description, image1, image2, image3)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return bd.query(sql, [
      data.numero,
      data.type,
      data.prix,
      data.capacite,
      data.statut || "DISPONIBLE",
      data.description,
      data.image1,
      data.image2,
      data.image3
    ]); // renvoie une promesse
  },

  findAll: (limit, offset) => {
    const sql = `SELECT * FROM rooms ORDER BY id DESC LIMIT ? OFFSET ?`;
    return bd.query(sql, [limit, offset]);
  },

  findAllWithoutLimit: () => {
    const sql = `SELECT * FROM rooms ORDER BY id DESC`;
    return bd.query(sql);
  },

  findById: (id) => {
    const sql = `SELECT * FROM rooms WHERE id = ?`;
    return bd.query(sql, [id]); // renvoie une promesse
  },

  update: (id, data) => {
    const sql = `
      UPDATE rooms SET
        numero = ?,
        type = ?,
        prix = ?,
        capacite = ?,
        statut = ?,
        description = ?,
        image1 = ?,
        image2 = ?,
        image3 = ?
      WHERE id = ?
    `;

    return bd.query(sql, [
      data.numero,
      data.type,
      data.prix,
      data.capacite,
      data.statut,
      data.description,
      data.image1,
      data.image2,
      data.image3,
      id
    ]);
  },

  updateStatut: (id, statut) => {
    const sql = `UPDATE rooms SET statut = ? WHERE id = ?`;
    return bd.query(sql, [statut, id]);
  },

  delete: (id) => {
    const sql = `DELETE FROM rooms WHERE id = ?`;
    return bd.query(sql, [id]);
  }
};

module.exports = Room;
