import express from "express";
import controllerAction from "../Core/helpers/controllerAction.js";
import WelcomeController from "../Http/Controllers/WelcomeController.js";
import ProductController from "../Http/Controllers/ProductController.js";

const router = express.Router();

router.get("/", controllerAction(WelcomeController, "index"));

router.get("/products", controllerAction(ProductController, "index"));
router.get("/products/create", controllerAction(ProductController, "create"));
router.post("/products", controllerAction(ProductController, "store"));
router.get("/products/edit/:id", controllerAction(ProductController, "edit"));
router.get("/products/:id", controllerAction(ProductController, "show"));
router.delete("/products/:id", controllerAction(ProductController, "destroy"));

export default router;
