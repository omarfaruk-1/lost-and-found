import "dotenv/config";
import app from "./src/app.js";
import appConfig from "./src/config/appConfig.js";
import connectDb from "./src/db/db.js";
import dns from "node:dns/promises"
dns.setServers(["1.1.1.1"]);

connectDb();
const PORT = appConfig.PORT ||  5000;


app.listen(PORT,()=>{
    console.log(`Server running port: ${PORT}`)
})
