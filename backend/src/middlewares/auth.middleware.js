import appConfig from "../config/appConfig.js";
import appError from "../errors/appError.js";
import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";
import userModel from "../models/user.model.js";

async function authMiddleware(req,res,next){
    try {
        const token=req.headers.authorization?.split(" ")[1];
        if(!token) return next(new appError("Unauthorized",403));

        const decoded = jwt.verify(token,appConfig.JWT_ACCESS_TOKEN);
        
        const session=await sessionModel.findById(decoded.sessionId);
        if(!session||session.revoked) return next(new appError("Session expired",401));

        const user = await userModel.findById(decoded.userId);
        if(!user) return next(new appError("User not found",404));

        req.user=user;
        next();
        
    } catch (error) {
        if(error.message==="JsonWebTokenError" || error.message==="TokenExpiredError"){
            return next(new appError("Invalid or expired token",401))
        }
        next(error)
    }
}

export default authMiddleware;