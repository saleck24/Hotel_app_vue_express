require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const app = require("./app");
const chatSocket = require("./sockets/chat.socket");

// Crée le serveur HTTP
const server = http.createServer(app);

// Crée le serveur Socket.IO
const io = new Server(server, {
  cors: { origin: "*" } // mettre URL frontend en prod
});

// Map des utilisateurs connectés
const usersOnline = new Map();

// Middleware Socket.IO pour authentification JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Token manquant"));

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    usersOnline.set(user.id, socket.id);
    next();
  } catch (err) {
    next(new Error("Token invalide"));
  }
});

// Initialise le chat (connexion, messages, déconnexion)
chatSocket(io, usersOnline);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available on http://localhost:${PORT}/api-docs`);
});
