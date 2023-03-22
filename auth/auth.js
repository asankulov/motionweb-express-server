const jwt = require('jsonwebtoken');

module.exports.isAuthenticated = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(401);
  }

  const token = authorization.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'TOP_SECRET', (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }

    const { user } = decoded;
    req.user = user;

    next();
  });
}
