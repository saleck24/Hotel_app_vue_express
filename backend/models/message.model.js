const bd = require("../bd/bd");

const Message = {
  // Ajouter un message
  create: (data) => {
    const sql = `
      INSERT INTO messages (from_user_id, to_user_id, message)
      VALUES (?, ?, ?)
    `;
    return bd.query(sql, [data.from_user_id, data.to_user_id, data.message]);
  },

  // Récupérer l’historique entre deux utilisateurs
  findByUsers: (user1, user2) => {
    const sql = `
      SELECT *
      FROM messages
      WHERE (from_user_id = ? AND to_user_id = ?)
         OR (from_user_id = ? AND to_user_id = ?)
      ORDER BY created_at ASC
    `;
    return bd.query(sql, [user1, user2, user2, user1]);
  }
};

module.exports = Message;
