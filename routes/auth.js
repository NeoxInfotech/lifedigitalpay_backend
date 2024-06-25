import express, { urlencoded } from "express"
import qr from "qrcode"
import bcrypt from "bcrypt"
import { User } from "../models/Users.js";
import { sendCookie } from "../utils/cookie.js";
import { userAuthenticated } from "../middlewares/userAuth.js";
import { Commission } from "../models/Commison.js";

const router = express.Router();





router.post("/register", async (req, res) => {
    try {
        const { name, username, password, address, pincode, state, mobile, email, company, adhaar, pan, acctype, accprice, under } = req.body
        let createuser = await User.findOne({ email, username });
        if (createuser) {
            res.status(500).json({
                message: "User already exists"
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const encryptPassword = await bcrypt.hashSync(password, salt)
            createuser = await User.create({
                name,
                username,
                password: encryptPassword,
                address,
                pincode,
                mobile,
                email,
                state,
                company,
                adhaar,
                pan,
                acctype,
                accprice,
                under
            })
            sendCookie(createuser, res, "Registered Successfully", 201)
            await Commission.create({ userId: username })
        }
    } catch (error) {
        res.status(400).json({
            err: "Something went wrong",
            error
        })
    }

})

router.post("/secondaryregister", async (req, res) => {
    try {
        const { name, username, password, address, pincode, state, mobile, email, company, adhaar, pan, acctype, accprice, under } = req.body
        let createuser = await User.findOne({ email, username });
        if (createuser) {
            res.status(500).json({
                message: "User already exists"
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const encryptPassword = await bcrypt.hashSync(password, salt)
            createuser = await User.create({
                name,
                username,
                password: encryptPassword,
                address,
                pincode,
                mobile,
                email,
                state,
                company,
                adhaar,
                pan,
                acctype,
                accprice,
                under
            })
            await Commission.create({ userId: username })
            res.status(200).json({
                success: true,
                message: "Registered Successfully"
            })
        }
    } catch (error) {
        res.status(400).json({
            err: "Something went wrong",
            error
        })
    }

})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        res.status(500).json({
            success: false,
            message: "User doesn't exist"
        })
    } else {
        const decrypt = await bcrypt.compareSync(password, user.password);
        if (!decrypt) {
            res.status(500).json({
                success: false,
                message: "Sorry credentials might be wrong"
            })
        } else {
            sendCookie(user, res, "Logged in Successfully", 201)
        }
    }
})




router.get("/refetch", userAuthenticated, async (req, res) => {
    try {
        res.status(201).json({
            success: true,
            user: req.user,
        })
    } catch (error) {
        res.status(201).json({
            success: false,
            msg: error,
        })
    }
})

router.get('/logout', async (req, res) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).json({ message: "Logged Out Successfully" })
    } catch (error) {
        res.status(500).json(error)
    }
})



router.post("/transaction", async (req, res) => {
    // TODO: transaction
})

router.post("/registerpay/:id", async (req, res) => {
    try {
        // TODO: payment logic first
        const user = await User.findById({ _id: req.params.id })
        await user.updateOne({ active: true })
        res.status(200).json({
            success: true,
            message: "Your Account has been Activated"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Occured, please check "
        })
    }
})














export default router