const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json("You're not authorized to access this page");

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401).json("Suspicious token");
      } else {
        const { session, name, role } = decoded;

        if (session && name && role) {
          // if path === /verifyToken pass role and name to body
          if (req.path === "/verifyToken") req.body = { session, name, role, ...req.body };
          return next();
        } else {
          res.status(401).json("Invalid token");
        }
      }
    });
  } catch (err) {
    res.status(401).json("Autentication error");
  }
};
