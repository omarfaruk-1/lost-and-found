import {Router} from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorization from "../middlewares/authorization.middleware.js";
import adminController from "../controllers/admin.controller.js";


const adminRoute=Router();

/**
 * get all users, items and claims method-get: localhost:5000/api/admin
 */
adminRoute.get("/dashboard",authMiddleware,authorization,adminController.admin);

export default adminRoute;
