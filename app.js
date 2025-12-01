import "./app/Core/bootstrap.js";
import express from "express";
import { Edge } from "edge.js";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./app/Routes/web.js";
import cookieParser from "cookie-parser";
import verifyCsurf from "./app/Core/middleware/csrf.js";
import methodOverride from "method-override";

const app = express();
const port = process.env.PORT || 8080;
// Use this way to still support old node js versions
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Edge as view engine
app.set("view engine", "edge");
app.set("views", "./app/Views");

// Create Edge instance with caching for production
const edge = Edge.create({
  cache: process.env.NODE_ENV === "production",
});

// Mount the views directory
edge.mount(new URL("./app/Views", import.meta.url));

// Configure Express to use Edge as the view engine
app.engine("edge", async (filePath, data, callback) => {
  // Use async/await to render templates that use `await` inside Edge templates
  try {
    const html = await edge.render(filePath, data);
    callback(null, html);
  } catch (err) {
    callback(err);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(verifyCsurf);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : "";
  next();
});
app.use(methodOverride("_method"));

app.use("/", routes);

// errors
app.use((req, res) => {
  res.status(404).render("errors/error", {
    code: 404,
    title: "Not Found",
    message: "Oops! The page you are looking for does not exist.",
    backUrl: "/",
    backMessage: "Go Back Home",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("errors/error", {
    code: 500,
    title: "Server Error",
    message: "Something went wrong. Please try again later.",
    backUrl: "/",
    backMessage: "Go Back Home",
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port} `);
});
