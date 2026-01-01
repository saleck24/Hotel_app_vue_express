const bd = require("../bd/bd");

exports.testBd = async (req, res) => {
  try {
    const [rows] = await bd.query("SELECT 1 + 1 AS result");
    res.json({
      message: "Connexion MySQL OK ✅",
      result: rows[0].result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur connexion MySQL ❌",
      error: error.message,
    });
  }
};
