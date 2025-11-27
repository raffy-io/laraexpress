import express from "express";
import controllerAction from "../Core/helpers/controllerAction.js";
import WelcomeController from "../Http/Controllers/WelcomeController.js";
import ProductController from "../Http/Controllers/ProductController.js";

const router = express.Router();

router.get("/", controllerAction(WelcomeController, "index"));

router.get("/products", controllerAction(ProductController, "index"));

export default router;
