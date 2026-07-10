import mongoose from "mongoose";
import appConfig from "../config/appConfig.js";


async function connectDb (){
    try {
        await mongoose.connect(appConfig.DB_URL)
        console.log("DB connected")
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

export default connectDb;