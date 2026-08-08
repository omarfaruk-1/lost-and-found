import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import authRoute from "./routes/auth.route.js";
import itemRoute from "./routes/item.route.js";

import claimRoute from "./routes/claim.route.js";
import adminRoute from "./routes/admin.route.js";

const app  = express();

app.use(express.json());
app.use(cookieParser());

//auth routes
app.use("/api/users",authRoute)
//Items routes
app.use("/api/items",itemRoute)
//claim routes
app.use("/api/claim",claimRoute)
//admin route
app.use("/api/admin",adminRoute)




app.use(errorHandler)
export default  app;