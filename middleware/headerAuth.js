const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json("You're not authorized to access this page");

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401).json("Suspicious token");
      } else {
        const { session, mail, email } = decoded;
        if (session && mail && email) return next();

        res.status(401).json("Invalid token");
      }
    });

    next();
  } catch (err) {
    res.status(401).json("Autentication error");
  }
};
