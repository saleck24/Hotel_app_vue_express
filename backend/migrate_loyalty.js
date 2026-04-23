const bd = require("./bd/bd");

async function migrate() {
  try {
    console.log("Migration: Ajout de la colonne points à la table users...");
    await bd.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS points INT DEFAULT 0
    `);
    console.log("Migration réussie !");
    process.exit(0);
  } catch (err) {
    console.error("Erreur migration:", err);
    process.exit(1);
  }
}

migrate();
