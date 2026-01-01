const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.createClient = async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    if (!nom || !email || !password) {
      return res.status(400).json({ message: "Champs manquants " });
    }

    // Vérifier si email existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email déjà utilisé " });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      nom,
      email,
      password: hashedPassword,
      role: "CLIENT", // FORCÉ
    });

    res.status(201).json({
      message: "Compte client créé avec succès ",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur création client",
      error: error.message,
    });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    if (!nom || !email || !password) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      nom,
      email,
      password: hashedPassword,
      role: "ADMIN",
    });

    res.status(201).json({
      message: "Admin créé avec succès",
      adminId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur création admin",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erreur récupération utilisateurs",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email ou mot de passe manquant" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  
    // COMPARAISON BCRYPT
    const validPassword = await bcrypt.compareSync(password, user.password);
    if (!validPassword){
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

     res.json({
      token,
      user: {
        id: user.id,
        nom: user.nom,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur login", error: error.message });
  }
};

//fonction mot de passe oublié
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email requis !!!" });
  }

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable !" });
  }

  // Générer token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // token expire dans 5 min
  await User.saveResetToken(user.id, resetToken, expiry);

  // Lien pour email
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  
  // Créer transporteur email
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // récupère l'email depuis .env
      pass: process.env.EMAIL_PASS, // récupère le mot de passe depuis .env
    },
  });

  // Contenu de l'email
  const mailOptions = {
    from: `"Hotel App" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Réinitialisation de mot de passe",
    text: `Bonjour, cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
    html: `<p>Bonjour,</p>
          <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>Ce lien expire dans 5 minutes.</p>`,
           
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Lien de réinitialisation envoyé par email" });
  } catch (err) {
    res.status(500).json({ message: "Impossible d'envoyer l'email", error: err.message });
  }
};

//fonction réinitialiser mot de passe
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token et mot de passe requis" });
  }

  const user = await User.findByResetToken(token);
  if (!user) {
    return res.status(400).json({ message: "Token invalide" });
  }

  if (new Date(user.reset_token_expiry) < new Date()) {
    return res.status(400).json({ message: "Token expiré" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.updatePassword(user.id, hashedPassword);

  res.json({ message: "Mot de passe réinitialisé avec succès" });
};