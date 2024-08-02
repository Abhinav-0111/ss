import express, { Router } from "express";
import {
    getOtherUser,
    userLogin,
    userLogout,
    userSignUp,
} from "../controller/userController.js";
import {
    deleteMessage,
    getMessage,
    sendMessage,
} from "../controller/messageController.js";

const router = express.Router();

router.post("/signUp", userSignUp);
router.post("/login", userLogin);
router.get("/logout", userLogout);
router.get("/otheruser/:id", getOtherUser);
router.post("/send/:id", sendMessage);
router.put("/message/:id", getMessage);
router.delete("/delete/:id", deleteMessage);

export default router;
