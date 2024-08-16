import express, { response } from "express"
import { User } from "../models/Users.js";
import { Wallet } from "../models/Wallet.js";
import axios from "axios"

const router = express.Router();





router.post("/paymentcreate/:id", async (req, res) => {
    try {
        const { amount } = req.body
        const user = await User.findOne({ _id: req.params.id })
        const orderid = "ORD" + (Math.floor(Math.random() * (900000000 - 1000000 + 1)) + 1000000).toString();
        const paymentorder = await axios.post("https://allapi.in/order/create", {
            token: process.env.PAYMENT_TOKEN,
            order_id: orderid,
            product_name: "One Plus",
            txn_amount: amount,
            txn_note: "Pay for Life Digi Pay",
            customer_name: user.name,
            customer_mobile: user.mobile,
            customer_email: user.email,
        }, { withCredentials: true })
        res.status(200).json({
            success: true,
            orderid: orderid,
            response: paymentorder.data,
            qr: paymentorder.data.results.qr_image,
            message: "payment has been created"
        })
    } catch (error) {
        console.log(error)
    }
})



router.post("/addmoney/:id", async (req, res) => {
    try {
        const { utr, orderid } = req.body
        const resp = await axios.post("https://allapi.in/order/status", {
            token: process.env.PAYMENT_TOKEN,
            order_id: orderid,
        }, { withCredentials: true })
        const utrres = resp.data.results.utr_number
        const restxn = resp.data.results.txn_amount
        console.log(resp.data)
        //TODO :- Need to add payment Api before below 
        if (utr.toString() === utrres) {
            const user = await User.findOne({ _id: req.params.id })
            await user.updateOne({ wallet: ~~user.wallet + ~~restxn })
            res.status(200).json({
                success: true,
                message: "Wallet money has been successfully added, Please Refresh"
            })

        } else {
            res.status(500).json({
                success: false,
                message: "UTR number might be wrong, or caught up some issue, contact your administrator"
            })
        }


    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Some error has been occured",
            err: error
        })
        console.log(error)
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