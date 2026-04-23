const Message = require("../models/message.model");

module.exports = (io, usersOnline) => {
  io.on("connection", (socket) => {
    console.log(`Utilisateur connecté: ${socket.user.id} (${socket.user.role})`);

    // Les admins rejoignent une room spéciale pour recevoir tous les messages clients
    if (socket.user.role === 'ADMIN') {
      socket.join('admins');
    }

    // Envoi de message
    socket.on("send_message", async (data) => {
      const { toUserId, message } = data;

      try {
        // Stocker le message en DB
        const newMessage = await Message.create({
          from_user_id: socket.user.id,
          to_user_id: toUserId,
          message
        });

        // Si l'expéditeur est un client, on envoie à l'admin spécifique ET on diffuse à tous les admins
        if (socket.user.role !== 'ADMIN') {
          io.to('admins').emit("receive_message", {
            fromUserId: socket.user.id,
            sender_name: socket.user.nom,
            message,
            timestamp: new Date().toISOString()
          });
        } else {
          // Si l'expéditeur est un admin, on envoie au destinataire spécifique (le client)
          const toSocketId = usersOnline.get(Number(toUserId));
          if (toSocketId) {
            io.to(toSocketId).emit("receive_message", {
              fromUserId: socket.user.id,
              sender_name: "Support Client",
              message,
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (err) {
        console.error("Erreur en envoyant le message :", err);
      }
    });

    // Déconnexion
    socket.on("disconnect", () => {
      usersOnline.delete(Number(socket.user.id));
      console.log(`Utilisateur déconnecté: ${socket.user.id}`);
    });
  });
};
