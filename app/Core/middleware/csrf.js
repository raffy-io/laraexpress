import csrf from "@dr.pogodin/csurf";

const csrfProtection = csrf({ cookie: true });

const verifyCsurf = (req, res, next) => {
  return csrfProtection(req, res, (err) => {
    if (err) {
      if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).render("errors/error", {
          code: 403,
          title: "Forbidden",
          message: "Your session has expired. Please refresh and try again.",
          backUrl: "/",
          backMessage: "Go Back Home",
        });
      }
      return next(err);
    }
    // Make token available in locals
    res.locals.csrfToken = req.csrfToken();
    next();
  });
};

export default verifyCsurf;
