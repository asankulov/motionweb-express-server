module.exports.permission = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      return next();
    }

    res.status(403).json({
      message: 'You\'re not allowed!',
    });
  }
}
