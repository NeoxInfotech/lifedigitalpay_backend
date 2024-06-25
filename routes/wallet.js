import express, { response } from "express"
import { User } from "../models/Users.js";
import { Wallet } from "../models/Wallet.js";

const router = express.Router();






router.post("/addmoney/:id", async (req, res) => {
    try {
        //TODO :- Need to add payment Api before below 
        const user = await User.findOne({ _id: req.params.id })
        const amount = ~~req.body.amount
        // console.log(amount + 10)
        await user.updateOne({ wallet: user.wallet + amount })
        res.status(200).json({
            success: true,
            message: "Wallet money has been successfully added, Please Refresh"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Some error has been occured",
            err: error
        })
    }
})



router.get("/wallethistory/:user", async (req, res) => {
    try {
        const history = await Wallet.find({ userdetails: req.params.user })
        res.status(200).json({
            success: true,
            response: history
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            response: error
        })
    }
})





export default router