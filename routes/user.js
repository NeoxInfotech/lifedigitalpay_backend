import express from "express"
import { User } from "../models/Users.js"
import bcrypt from "bcrypt"


const router = express.Router()




// Editing a user's password
router.put("/:id", async (req, res) => {
    try {
        const { password } = req.body
        const salt = await bcrypt.genSalt(10);
        const updatedPassword = await bcrypt.hashSync(password, salt)
        const updatedUser = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { password: updatedPassword } });
        res.status(201).json({
            success: true,
            message: updatedUser
        })
    } catch (error) {
        res.status(500).json(error)
    }

})

// editing a user's profile
router.put("/profile/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
        res.status(201).json({
            success: true,
            message: updatedUser
        })
    } catch (error) {
        res.status(500).json(error)
    }

})



// ***ADMIN ROUTES TO HANDLE USERS

// *get all users
router.get("/allusers", async (req, res) => {
    try {
        const users = await User.find();
        res.status(201).json({
            success: true,
            message: users
        })
    } catch (error) {
        res.status(500).json(error)
    }

})


// *** DISTRIBUTORS ROUTES TO GET USERS THEY CREATED

router.get("/distusers/:user", async (req, res) => {
    try {
        const distUsers = await User.find({ under: req.params.user })
        res.status(201).json({
            success: true,
            message: distUsers
        })
    } catch (error) {
        res.status(500).json(error)
    }
})



// *** Activ or inactive a user through admin or distributor 
router.post("/accountaction/:user", async (req, res) => {
    const { activate } = req.body;
    try {
        const getuser = await User.findOne({ username: req.params.user })
        await getuser.updateOne({ active: activate })
        res.status(201).json({
            success: true,
            message: "Actions has been succesfully done"
        })
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})





// *Transfer Money to user

router.post("/transfermoney/:user", async (req, res) => {
    try {
        const { transferamount } = req.body
        const usertotransfer = await User.findOne({ username: req.params.user })
        if (!usertotransfer) {
            res.status(500).json({
                message: "Sorry No Mentioned users exists"
            })
        } else {
            const transfer = await usertotransfer.updateOne({ wallet: ~~usertotransfer.wallet + ~~transferamount })
            res.status(200).json({
                success: true,
                message: `Amount has been successfully added to ${usertotransfer.username}'s wallet`
            })
        }
    } catch (error) {

    }
})







export default router