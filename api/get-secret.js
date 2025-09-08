// api/get-secret.js
module.exports = (req, res) => {
  res.status(200).json({ secret: process.env.FIREBASE_CONFIG_SECRET_VALUE });
};
