const bd = require("../bd/bd");

exports.getDashboardStats = async (req, res) => {
    try {
        const [revenueRes] = await bd.query("SELECT SUM(total) as revenue FROM reservations WHERE statut = 'CONFIRMEE'");
        const [pendingRes] = await bd.query("SELECT COUNT(*) as pending FROM reservations WHERE statut = 'EN_ATTENTE'");
        const [roomsRes] = await bd.query("SELECT COUNT(*) as total, SUM(CASE WHEN statut = 'OCCUPEE' THEN 1 ELSE 0 END) as occupied FROM rooms");
        const [reviewsRes] = await bd.query("SELECT AVG(note) as avgRating, COUNT(*) as count FROM reviews");

        const stats = {
            revenue: revenueRes[0].revenue || 0,
            pendingReservations: pendingRes[0].pending || 0,
            occupancy: {
                total: roomsRes[0].total || 0,
                occupied: roomsRes[0].occupied || 0,
                rate: roomsRes[0].total > 0 ? Math.round((roomsRes[0].occupied / roomsRes[0].total) * 100) : 0
            },
            reviews: {
                averageRating: parseFloat(reviewsRes[0].avgRating || 0).toFixed(1),
                totalCount: reviewsRes[0].count || 0
            }
        };

        res.json(stats);
    } catch (err) {
        console.error("Erreur Dashboard Stats:", err);
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
};
