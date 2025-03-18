import express, { NextFunction, Request, Response, Router } from "express";
import AuthUserController from "../controller/UserController";

import { ExpressAdapter } from "@bull-board/express";
import { Queue } from "bullmq";
import { verifyJwtToken } from "../jwt/jwt_helper";
import { connection } from "../redis/bull_mq.connection";
import { RegisterationValidator } from "../validator/Registeration.validator";
import { myWorker } from "../worker/OrderWorker";

const router: Router = express.Router();

// User Registration Route
router.post("/register", AuthUserController.createUser);

router.post('/login',AuthUserController.loginUser)

router.post('/refersh-token',AuthUserController.refreshToken)

router.get('/user/:uid',AuthUserController.getUserByID)

router.post('/request-otp',AuthUserController.requestForOTP)

router.post("/reset-password-with-otp",AuthUserController.resetPasswordWithOTP )





export default router; // Use ES module export



