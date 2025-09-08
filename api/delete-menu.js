// Archivo: api/delete-menu.js
const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://menu-cafeteria-crpo-default-rtdb.firebaseio.com"
  });
}

const db = admin.database();

module.exports = async (req, res) => {
  try {
    await db.ref("menuHoy").remove();
    console.log("Menú borrado exitosamente.");
    return res.status(200).send({ message: "Menú borrado." });
  } catch (error) {
    console.error("Error al borrar el menú:", error);
    return res.status(500).send({ message: "Error al borrar el menú." });
  }
};
