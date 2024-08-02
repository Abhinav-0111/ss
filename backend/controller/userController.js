import bcryptjs from "bcryptjs";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

export const userSignUp = async (req, res) => {
    try {
        const { name, username, password, gender, profilePhoto } = req.body;
        const exist = await User.findOne({ username });
        if (exist) {
            return res.status(401).json("Username already Exists");
        }
        const hashedPassword = await bcryptjs.hash(password, 16);
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        await User.create({
            name,
            username,
            password: hashedPassword,
            gender,
            profilePhoto:
                gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
        });
        return res.status(200).json({ message: "Account create successfully" });
    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json("Username not found");
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json("Invaild password");
        }
        const tokenData = {
            userId: user._id,
        };
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
            })
            .json({
                message: `Welcome back ${user.name}`,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    gender: user.gender,
                    profilePhoto: user.profilePhoto,
                },
            });
    } catch (error) {
        return res.status(500).json({ err: err.message });
    }
};

export const userLogout = async (req, res) => {
    try {
        return res
            .status(200)
            .cookie("token", "", { expiresIn: new Date(Date.now()) })
            .json({
                message: "user logout successfully",
            });
    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
};

export const getOtherUser = async (req, res) => {
    try {
        const loggedInUserId = req.params.id;
        const otherUsers = await User.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
};
