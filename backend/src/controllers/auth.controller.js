import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto"
import appConfig from "../config/appConfig.js";
import sessionModel from "../models/session.model.js";
import appError from "../errors/appError.js";

async function register(req,res,next){
    try {
        const {username,email,password}=req.body;
        if(!username||!email||!password){
            return res.status(400).json({message:"All fields are required"});
        };
        const userExist= await userModel.findOne({
            $or:[{username},{email}]
        });
        if(userExist) return res.status(409).json({message:"Username or email already exist"});
        
        const hashPassword=await bcrypt.hash(password,10);
        const user = await userModel.create({
            username,
            email,
            password:hashPassword
        });

        const refreshToken = jwt.sign(
            {userId:user._id,role:user.role},
            appConfig.JWT_REFRESH_TOKEN,
            {expiresIn:"7d"}
        );
        const refreshTokenHash= crypto.createHash("sha256").update(refreshToken).digest("hex");
        const session = await sessionModel.create({
            user:user._id,
            refreshTokenHash:refreshTokenHash,
            ip:req.ip,
            userAgent:req.headers["user-agent"] || "unknown"
        });

        const accessToken = jwt.sign(
            {userId:user._id,role:user.role,sessionId:session._id},
            appConfig.JWT_ACCESS_TOKEN,
            {expiresIn:"15m"}
        );

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        });

        res.status(201).json({
            message:"User registered successfully",
            user:{
                username:user.username,
                email:user.email,
                role:user.role,
                isVerified:user.isVerified
            },
            accessToken:accessToken
        })
    } catch (error) {
        next(error)
    }

}

async function login(req,res,next){
    try {
        const {email,password}=req.body;
        if(!email || !password) return res.status(400).json({message:"Email and password are required"});
        const user = await userModel.findOne({email}).select("+password");
        if(!user) return next(new appError("User not found",404));
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch) return next(new appError("Invalid password",403));

        const refreshToken = jwt.sign(
            {userId:user._id,role:user.role},
            appConfig.JWT_REFRESH_TOKEN,
            {expiresIn:"7d"}
        );
        const refreshTokenHash= crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.create({
            user:user._id,
            refreshTokenHash:refreshTokenHash,
            ip:req.ip,
            userAgent: req.headers["user-agent"] || "Unknown",
        });
        const accessToken = jwt.sign(
            {userId:user._id,role:user.role,sessionId:session._id},
            appConfig.JWT_ACCESS_TOKEN,
            {expiresIn:"15m"}
        );

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        });
        res.status(200).json({
            message:"User login successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                role:user.role,
                isVerified:user.isVerified
            },
            accessToken:accessToken
        })
    } catch (error) {
        next(error)
    }
}

async function getMe(req,res,next){
    try {
        res.status(200).json({
            message:"User fetched successfully",
            id:req.user._id,
            username:req.user.username,
            email:req.user.email,
            role:req.user.role,
            isVerified:req.user.isVerified
        })
    } catch (error) {
        next(error)
    }
}

async function refreshToken(req,res,next){
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return next(new appError("refresh token not found",401));
        const decoded = jwt.verify(refreshToken,appConfig.JWT_REFRESH_TOKEN);
        const refreshTokenHash= crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked:false
        })
        if(!session) return next(new appError("Session not found",401));
        const accessToken=jwt.sign(
            {userId:decoded.userId,role:decoded.role,sessionId:session._id},
            appConfig.JWT_ACCESS_TOKEN,
            {expiresIn:"15m"}
        );

        const newRefreshToken=jwt.sign(
            {userId:decoded.userId,role:decoded.role},
            appConfig.JWT_REFRESH_TOKEN,
            {expiresIn:"7d"}
        );
        const newRefreshTokenHash=crypto.createHash("sha256").update(newRefreshToken).digest("hex");
        session.refreshTokenHash=newRefreshTokenHash;
        await session.save();

        res.cookie("refreshToken",newRefreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:7*24*60*60*1000//7day
        }),
        
        res.status(200).json({
            message:"Access token refresh successfully",
            accessToken:accessToken
        })

    } catch (error) {
        next(error)
    }
}

async function logOut(req,res,next){
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return next(new appError("Refresh token not found",401));
        const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");
        const session=await sessionModel.findOne({
            refreshTokenHash,
            revoked:false
        });
        if(!session) return next(new appError("Session not found", 401));
        session.revoked=true;
        await session.save();

        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        next(error)
    }
}

async function logOutAll(req,res,next){
    try {
        const refreshToken=req.cookies.refreshToken;
        if(!refreshToken) return next(new appError("Refresh token not found",401));
        const decoded = jwt.verify(refreshToken,appConfig.JWT_REFRESH_TOKEN);
        const session=await sessionModel.updateMany(
            {
                user:decoded.userId,
                revoked:false
            },
            {revoked:true}
        );
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
            sameSite:"strict"
        })

        res.status(200).json({message:"Logged out from all devices successfully"})
    } catch (error) {
        next(error)
    }
}


export default {register,login,getMe,refreshToken,logOut,logOutAll};