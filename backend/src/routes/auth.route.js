import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";


const authRoute=Router();


/**
 *? register user method post: http://localhost:5000/api/users/register
 */
authRoute.post("/register",authController.register);

/**
 * ? login user method post: http://localhost:5000/api/user/log-in
 */
authRoute.post("/log-in",authController.login);

/**
 * ? Get me method get : http://localhost:5000/api/user/get-me
 */
authRoute.get("/get-me",authMiddleware,authController.getMe);
/**
 * user dashboard : get : http://localhost:5000/api/user/dashboard
 */
authRoute.get("/dashboard",authMiddleware,userController.dashboard);

/**
 * ? generate access token method-post: http://localhost:5000/api/user/refresh-token
 */
authRoute.post("/refresh-token",authController.refreshToken);

/**
 * ? log-out user method-post: http://localhost:5000/api/user/log-out
 */
authRoute.post("/log-out",authController.logOut);

/**
 *? log out from all devices method post:http://localhost:5000/api/user/log-out-all
 */
authRoute.post("/log-out-all",authController.logOutAll);

/**
 * ? email verification method get: http://localhost:5000/api/user/verify-email
 */
authRoute.get("/verify-email",authController.emailVerification);

/**
 * ? email verification method get: http://localhost:5000/api/user/resendverify-email
 */
authRoute.post("/resend-verification",authController.reSendVerification);

authRoute.post("/forgot-password", authController.forgetPassword);

authRoute.post("/reset-password", authController.resetPassword);


export default authRoute;