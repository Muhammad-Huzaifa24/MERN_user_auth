// middlewares/auth.js
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.CLIENT_ID);

const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  return ticket.getPayload();
};

const verifyJwtToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    try {
      const payload = await verifyGoogleToken(token);
      req.user = payload;
      return next();
    } catch (googleError) {
      try {
        const user = await verifyJwtToken(token);
        req.user = user;
        return next();
      } catch (jwtError) {
        return res.sendStatus(403);
      }
    }
  } catch (err) {
    return res.sendStatus(403);
  }
};

module.exports = { authenticateToken };
