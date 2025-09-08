// Archivo: api/auth.js
module.exports = async (req, res) => {
  let password;
  try {
    password = req.body.password;
  } catch (e) {
    res.status(400).send({ success: false, message: "Solicitud no válida" });
    return;
  }
  const correctPassword = process.env.ADMIN_PASSWORD;
  if (password === correctPassword) {
    res.status(200).send({ success: true });
  } else {
    res.status(401).send({ success: false, message: "Contraseña incorrecta" });
  }
};