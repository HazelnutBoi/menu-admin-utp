
module.exports = async (req, res) => {
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (!correctPassword) {
    return res.status(500).send({ success: false, message: "Error de configuración de variable de entorno." });
  }

  let password;
  try {
    password = req.body.password;
  } catch (e) {
    return res.status(400).send({ success: false, message: "Solicitud no válida." });
  }

  if (password === correctPassword) {
    return res.status(200).send({ success: true });
  } else {

    return res.status(401).send({ success: false, message: "Contraseña incorrecta", received: password, expected: correctPassword });
  }
};

