// Archivo: api/auth.js (versión de diagnóstico)
module.exports = async (req, res) => {
  const correctPassword = process.env.ADMIN_PASSWORD;

  // Si la variable no se lee correctamente, devolvemos un mensaje de error
  if (!correctPassword) {
    return res.status(500).send({ success: false, message: "Error de configuración de variable de entorno." });
  }

  let password;
  try {
    password = req.body.password;
  } catch (e) {
    return res.status(400).send({ success: false, message: "Solicitud no válida." });
  }

  // Comparamos el password recibido con la variable
  if (password === correctPassword) {
    return res.status(200).send({ success: true });
  } else {
    // Si la contraseña es incorrecta, devolvemos el valor que se leyó
    // Esto nos ayudará a saber si hay un espacio extra o un error de lectura
    return res.status(401).send({ success: false, message: "Contraseña incorrecta", received: password, expected: correctPassword });
  }
};
