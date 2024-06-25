import jwt from "jsonwebtoken"
import { User } from "../models/Users.js";




export const userAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        res.status(500).json({
            success: false,
            message: "User Not logged in"
        })
    } else {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id);
        next()

    }
}