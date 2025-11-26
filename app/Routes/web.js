import express from "express";
import controllerAction from "../Core/helpers/controllerAction.js";
import WelcomeController from "../Controllers/WelcomeController.js";
const router = express.Router();

router.get("/", controllerAction(WelcomeController, "index"));

export default router;
