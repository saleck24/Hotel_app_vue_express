const Message = require("../models/message.model");

module.exports = (io, usersOnline) => {
  io.on("connection", (socket) => {
    console.log(`Utilisateur connecté: ${socket.user.id}`);

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

        // Envoyer en temps réel au destinataire s'il est connecté
        const toSocketId = usersOnline.get(toUserId);
        if (toSocketId) {
          io.to(toSocketId).emit("receive_message", {
            fromUserId: socket.user.id,
            message,
            timestamp: newMessage.createdAt
          });
        }
      } catch (err) {
        console.error("Erreur en envoyant le message :", err);
      }
    });

    // Déconnexion
    socket.on("disconnect", () => {
      usersOnline.delete(socket.user.id);
      console.log(`Utilisateur déconnecté: ${socket.user.id}`);
    });
  });
};
