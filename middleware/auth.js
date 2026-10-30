const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.get("Authorization");
  const [scheme, token] = authorization?.split(" ") || [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentification requise." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.id) {
      return res.status(401).json({ error: "Jeton invalide." });
    }

    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: "Jeton invalide ou expiré." });
  }
};
