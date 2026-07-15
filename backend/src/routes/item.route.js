import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import itemController from "../controllers/item.controller.js";
import uploadImageItem from "../middlewares/upload.middleware.js";

const itemRoute = Router();


itemRoute.post("/",authMiddleware,uploadImageItem,itemController.items);


export default itemRoute;