const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    // Lógica para guardar el menú
    try {
      const { fecha, items } = req.body;
      const data = {
        fecha: fecha,
        // Almacenamos todos los campos que vienen del front-end
        items: items
      };

      await db.collection("menus").doc("menuHoy").set(data);
      
      console.log("Menú guardado exitosamente en Firestore.");
      return res.status(200).send({ success: true, message: "Menú guardado." });
    } catch (error) {
      console.error("Error al guardar el menú:", error);
      return res.status(500).send({ success: false, message: "Error al guardar el menú." });
    }
  } 
  
  else if (req.method === 'DELETE') {
    // Lógica para borrar el menú
    try {
      await db.collection("menus").doc("menuHoy").delete();
      
      console.log("Menú borrado exitosamente de Firestore.");
      return res.status(200).send({ success: true, message: "Menú borrado." });
    } catch (error) {
      console.error("Error al borrar el menú:", error);
      return res.status(500).send({ success: false, message: "Error al borrar el menú." });
    }
  } 
  
  else {
    return res.status(405).send({ success: false, message: "Método no permitido." });
  }
};
