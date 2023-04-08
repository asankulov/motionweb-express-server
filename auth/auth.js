const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../constants');

module.exports.isAuthenticated = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(401);
  }

  const token = authorization.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }

    const { user } = decoded;
    req.user = user;

    next();
  });
}
