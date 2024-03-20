const jwt = require('jsonwebtoken');
const {tokenBlacklist} = require('./blacklist')
const authenticate = async (req, res, next) => {

  const token = req.headers.authorization;
  if (!token || tokenBlacklist.has(token)) {
    req.user = null
    return next();
  }
 
  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decoded)
    req.user = decoded;
    req.token = token; 
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authenticate;
