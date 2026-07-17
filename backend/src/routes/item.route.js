import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import itemController from "../controllers/item.controller.js";
import uploadImageItem from "../middlewares/upload.middleware.js";

const itemRoute = Router();

/**
 * create lost and found method-post: localhost:5000/api/items
 */
itemRoute.post("/",authMiddleware,uploadImageItem,itemController.items)
/**
 * get all lost and found items method-get: localhost:5000/api/items
 */
itemRoute.get("/",authMiddleware,itemController.getItems);
/**
 * specific user items method-get: localhost:5000/api/items/my-items
 */
itemRoute.get("/my-items",authMiddleware,itemController.myItems)
/**
 * specific items by id method-get: localhost:5000/api/items/:itemId
 */
itemRoute.get("/:itemId",authMiddleware,itemController.getItemById);
/**
 * update item method-patch: localhost:5000/api/items/:itemId
 */
itemRoute.patch("/:itemId",authMiddleware,uploadImageItem,itemController.updateItem)
/**
 * delete item method-delete:  localhost:5000/api/items/:itemId
 */
itemRoute.delete("/:itemId",authMiddleware,itemController.deleteItem)



export default itemRoute;