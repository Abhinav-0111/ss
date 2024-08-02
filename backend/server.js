import express from "express";
import dotenv from "dotenv";
import Connection from "./config/database.js";
import router from "./route/route.js";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";

dotenv.config();
const PORT = process.env.PORT;
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

server.listen(PORT, () => {
    Connection();
    console.log(`Server running successfully on port ${PORT}`);
});
