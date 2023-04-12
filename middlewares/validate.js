module.exports = (schema, source = 'body') => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[source], { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: 'Validation failed!',
        details: error.details.map(({ message }) => message),
      });
    }

    req[source] = value;

    next();
  };
}
