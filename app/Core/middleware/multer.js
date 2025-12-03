import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const multerMiddleware = (req, res, next) => {
  if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
    upload.any()(req, res, next);
  } else {
    next();
  }
};

export default multerMiddleware;
