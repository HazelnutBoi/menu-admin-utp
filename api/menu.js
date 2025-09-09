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
    // Esta parte no necesita la clave secreta ya que es llamada desde el administrador.
    try {
      const { fecha, items } = req.body;
      
      const newItems = items.map(item => {
        if (item.esProximo && item.tiempo > 0) {
            item.readyAt = Date.now() + (item.tiempo * 60 * 1000);
            delete item.tiempo;
        } else {
            delete item.esProximo;
            delete item.tiempo;
        }
        return item;
      });

      const data = {
        fecha: fecha,
        items: newItems
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
    // Esta parte ahora requiere la clave secreta.
    if (req.query.secret !== process.env.CRON_SECRET) {
      return res.status(403).send({ success: false, message: "Acceso denegado. Clave secreta incorrecta." });
    }
    
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
