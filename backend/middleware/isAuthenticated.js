import jwt from "jsonwebtoken";

const isAuthentication = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decode) {
            return res.status(401).json({ message: "Invaild token" });
        }
        req.id = decode.userId;
        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
export default isAuthentication;
const req = {
    id: "",
};
req.id = "sdlbgnjdfn";
