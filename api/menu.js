const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    try {
      const { fecha, items } = req.body;
      const newItems = items.map(item => {
        const newItem = {
            descripcion: item.descripcion,
            precioEst: item.precioEst,
            precioAdm: item.precioAdm,
            esProximo: item.esProximo
        };
        if (item.esProximo && item.tiempo > 0) {
            newItem.readyAt = Date.now() + (item.tiempo * 60 * 1000);
        } else {
            delete newItem.esProximo;
        }
        return newItem;
      });

      await db.collection("menus").doc("menuHoy").set({ fecha, items: newItems });
      return res.status(200).send({ success: true, message: "Menú guardado." });
    } catch (error) {
      return res.status(500).send({ success: false, error: error.message });
    }
  } 
  else if (req.method === 'DELETE') {
    if (req.query.secret !== process.env.CRON_SECRET) return res.status(403).send({ success: false });
    await db.collection("menus").doc("menuHoy").delete();
    return res.status(200).send({ success: true });
  }
  return res.status(405).send({ success: false });
};
