const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userData = jwt.verify(token, process.env.JWT_TOKEN_PRIVATE_KEY);
    req.userData = userData;
    next();
  } catch (error) {
    return res.status(403).json({
      status: false,
      message: "You are not authorized to access this resource!",
    });
  }
};
