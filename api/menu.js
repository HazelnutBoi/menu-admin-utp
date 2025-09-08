// api/menu.js
const admin = require('firebase-admin');

// Inicializa la app de Firebase solo si aún no está inicializada
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  } catch (error) {
    console.log("Error initializing admin:", error);
  }
}

const db = admin.database();

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const menuData = req.body;
    try {
      await db.ref('menuHoy').set(menuData);
      res.status(200).json({ success: true, message: 'Menú guardado con éxito.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al guardar el menú.', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await db.ref('menuHoy').remove();
      res.status(200).json({ success: true, message: 'Menú borrado con éxito.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al borrar el menú.', error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Método no permitido.' });
  }
};
