const CRON_SECRET = process.env.CRON_SECRET;
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: "Método no permitido." });
    }

    if (!CRON_SECRET) {
        return res.status(500).json({ success: false, message: "CRON_SECRET no configurado en el servidor." });
    }

    try {
        const adminDomain = req.headers['x-forwarded-host'] || req.headers['host'];
        const response = await fetch(`https://${adminDomain}/api/menu?secret=${CRON_SECRET}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (response.ok && data.success) {
            return res.status(200).json({ success: true, message: "Menú eliminado exitosamente." });
        } else {
            console.error("Error en la API de borrado:", data.message);
            return res.status(response.status).json({ success: false, message: `Error en el borrado: ${data.message}` });
        }
    } catch (error) {
        console.error("Error al llamar a la API de borrado:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};
