import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import authRoute from "./routes/auth.route.js";
import itemRoute from "./routes/item.route.js";
import adminRoute from "./routes/admin.router.js";

const app  = express();

app.use(express.json());
app.use(cookieParser());

//auth routes
app.use("/api/users",authRoute)
//Items routes
app.use("/api/items",itemRoute)
//admin route
app.use("/api/admin",adminRoute)




app.use(errorHandler)
export default  app;