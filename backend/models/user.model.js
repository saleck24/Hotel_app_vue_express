const bd = require("../bd/bd");

const User = {
  create: async (user) => {
    const sql = `
      INSERT INTO users (nom, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await bd.query(sql, [
      user.nom,
      user.email,
      user.password,
      user.role || "CLIENT",
    ]);
    return result;
  },

  findAll: async () => {
    const [rows] = await bd.query("SELECT id, nom, email, role, created_at FROM users");
    return rows;
  },

  findByEmail: async (email) => {
    const [rows] = await bd.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0]; // undefined si pas trouvé
  },

  findByResetToken: async (token) => {
  const [rows] = await bd.query(
    "SELECT * FROM users WHERE reset_token = ?",
    [token]
  );
  return rows[0];
},

saveResetToken: async (id, token, expiry) => {
  return bd.query(
    "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
    [token, expiry, id]
  );
},

updatePassword: async (id, password) => {
  return bd.query(
    "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
    [password, id]
  );
},

updateProfile: async(id, data) => {
  const fields = [];
  const values = [];

  if (data.nom !== undefined) {
    fields.push("nom = ?");
    values.push(data.nom);
  }

  if (data.profile_image !== undefined) {
    fields.push("profile_image = ?");
    values.push(data.profile_image);
  }

  values.push(id);

  const sql = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = ?
  `;

  return bd.query(sql, values);
},

  findById: async(id) => {
    const [rows] = await bd.query(
      "SELECT id, nom, role, profile_image FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

};

module.exports = User;
