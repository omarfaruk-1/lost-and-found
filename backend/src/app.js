import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import authRoute from "./routes/auth.route.js";

const app  = express();

app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/users",authRoute)




app.use(errorHandler)
export default  app;