import express, { response } from "express"
import axios from "axios"
import { Recharge } from "../models/Recharge.js";
import { User } from "../models/Users.js";
import { Wallet } from "../models/Wallet.js";
import { Commission } from "../models/Commison.js";

const router = express.Router();






router.post('/mobilerecharge/:id', async (req, res) => {
    try {
        const { mobile, amount, provider, stv, balance, userdetail, prvdname } = req.body;

        const order = (Math.floor(Math.random() * (90000000 - 100000 + 1)) + 100000).toString();
        const user = await User.findOne({ _id: req.params.id })

        // *** Commission of recharge Logic
        const com = await Commission.findOne({ userId: user.username })
        let com_amount = ""
        if (prvdname === "Jio") {
            com_amount = com.jio
        } else if (prvdname === "Idea") {
            com_amount = com.idea
        } else if (prvdname === "Bsnl") {
            com_amount = com.bsnl
        } else if (prvdname === "Vodafone") {
            com_amount = com.vodafone
        } else if (prvdname === "Airtel") {
            com_amount = com.airtel
        }
        const commissionGiven = com_amount / 100 * amount


        if (user.wallet < amount) {
            res.status(500).json({ success: false, message: " Error :Please update your wallet" })
        } else {
            const response = await axios.post('https://mrobotics.in/api/recharge', {
                api_token: process.env.RECHARGE_TOKEN,
                mobile_no: mobile,
                amount,
                company_id: provider,
                order_id: order,
                is_stv: stv
            }, { withCredentials: true })

            if (response.data.status === "failure") {
                await Recharge.create({ orderId: order, number: mobile, amount: amount, balance: balance, refid: response.data.id, status: response.data.status, userdetails: userdetail, userId: userdetail, operator: prvdname })
                res.status(500).json({
                    success: true,
                    response: "failure",
                    message: "Recharge has been failed due to some reasons"
                })
            } else {
                await Recharge.create({
                    userdetails: user?.username,
                    orderId: order,
                    number: mobile,
                    amount: amount,
                    operator: prvdname,
                    balance: balance,
                    refid: response.data.id,
                    status: response.data.status,
                    userId: userdetail,
                    txnId: response.data.tnx_id

                })
                await user.updateOne({ wallet: user.wallet - amount })
                await user.updateOne({ wallet: user.wallet + commissionGiven })
                await Wallet.create({ userdetails: user?.username, txntype: "Recharge", amount: commissionGiven, opening: amount - commissionGiven, closing: ~~amount, status: response.data.status })
                res.status(200).json({
                    success: true,
                    message: response.data,
                    call: "Records saved",
                })
            }

        }


    } catch (error) {
        console.log(error)
    }
})


router.post('/dthrecharge/:id', async (req, res) => {
    try {

        const res_dth = await axios.post('https://multipeapi.in/api/get/resources', { token: "AtsLY8PTwgUXQTNr2lHn7LJYhehUza" }, { withCredentials: true })
        console.log(res_dth.data)
        res.status(200).json({
            success: true,
            response: res_dth.data
        })
    } catch (error) {
        console.log(error)
    }
})



router.get('/rechargehistory/:user', async (req, res) => {
    try {
        const history = await Recharge.find({ userId: req.params.user })
        res.status(200).json({
            success: true,
            response: history
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
})


export default router