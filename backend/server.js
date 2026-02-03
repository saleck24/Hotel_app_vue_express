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
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Map des utilisateurs connectés
const usersOnline = new Map();

// Helper pour parser les cookies
const parseCookies = (str) => {
  if (!str) return {};
  return str.split(';').reduce((res, c) => {
    const parts = c.trim().split('=');
    const key = parts[0];
    const val = parts.slice(1).join('=');
    res[key] = decodeURIComponent(val);
    return res;
  }, {});
};

// Middleware Socket.IO pour authentification JWT
io.use((socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie;
  const cookies = parseCookies(cookieHeader);

  const token = cookies.token || socket.handshake.auth.token;

  if (!token) return next(new Error("Token manquant"));

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    usersOnline.set(Number(user.id), socket.id);
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
