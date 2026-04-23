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
  findByUsers: async (userId, otherUserId, role) => {
    // Si l'un des deux est admin, on récupère tout l'historique entre le client et LE SUPPORT (tous les admins)
    if (role === 'ADMIN' || (await Message.isUserAdmin(otherUserId))) {
      const clientId = role === 'ADMIN' ? otherUserId : userId;
      const sql = `
        SELECT m.*, IF(u.role = 'ADMIN', 'Support Client', u.nom) as sender_name
        FROM messages m
        JOIN users u ON m.from_user_id = u.id
        WHERE (m.from_user_id = ? AND m.to_user_id IN (SELECT id FROM users WHERE role = 'ADMIN'))
           OR (m.from_user_id IN (SELECT id FROM users WHERE role = 'ADMIN') AND m.to_user_id = ?)
        ORDER BY m.created_at ASC
      `;
      const [rows] = await bd.query(sql, [clientId, clientId]);
      return rows;
    }

    const sql = `
      SELECT m.*, IF(u.role = 'ADMIN', 'Support Client', u.nom) as sender_name
      FROM messages m
      JOIN users u ON m.from_user_id = u.id
      WHERE (m.from_user_id = ? AND m.to_user_id = ?)
         OR (m.from_user_id = ? AND m.to_user_id = ?)
      ORDER BY m.created_at ASC
    `;
    const [rows] = await bd.query(sql, [userId, otherUserId, otherUserId, userId]);
    return rows;
  },

  // Helper pour savoir si un utilisateur est admin
  isUserAdmin: async (userId) => {
    const [rows] = await bd.query("SELECT role FROM users WHERE id = ?", [userId]);
    return rows[0]?.role === 'ADMIN';
  },

  // Récupérer la liste des IDs des utilisateurs avec qui l'utilisateur a conversé
  getConversations: async (userId, role) => {
    if (role === 'ADMIN') {
      // Pour un admin, on montre tous les clients qui ont contacté n'importe quel admin
      const sql = `
        SELECT DISTINCT 
          u.id, u.nom, u.role
        FROM users u
        JOIN messages m ON (u.id = m.from_user_id OR u.id = m.to_user_id)
        WHERE (m.from_user_id IN (SELECT id FROM users WHERE role = 'ADMIN') OR m.to_user_id IN (SELECT id FROM users WHERE role = 'ADMIN'))
          AND u.role = 'CLIENT'
      `;
      const [rows] = await bd.query(sql);
      return rows;
    }

    const sql = `
      SELECT DISTINCT 
        u.id, u.nom, u.role
      FROM users u
      JOIN messages m ON (u.id = m.from_user_id OR u.id = m.to_user_id)
      WHERE (m.from_user_id = ? OR m.to_user_id = ?)
        AND u.id != ?
    `;
    const [rows] = await bd.query(sql, [userId, userId, userId]);
    return rows;
  }
};

module.exports = Message;
