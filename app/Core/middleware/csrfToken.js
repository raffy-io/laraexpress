const csrfToken = () => {
  return (req, res, next) => {
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : "";
    next();
  };
};

export default csrfToken;
