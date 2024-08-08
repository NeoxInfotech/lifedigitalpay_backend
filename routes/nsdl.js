import express, { response } from "express"
const router = express.Router();
import axios from "axios"
import { User } from "../models/Users.js";
import { NSDL } from "../models/Nsdl.js";
import { Wallet } from "../models/Wallet.js";
import { Commission } from "../models/Commison.js";






router.post("/activation/:user", async (req, res) => {
    try {
        const service_charge = 199
        const user = await User.findOne({ username: req.params.user })
        if (user.wallet < service_charge) {
            res.status(500).json({
                success: false,
                message: "Please Update Your Wallet"
            })
        } else {
            await user.updateOne({ wallet: ~~user.wallet - ~~service_charge, nsdlactive: true })
            await Wallet.create({
                userdetails: user.username,
                txntype: "NSDL Activation Charge",
                amount: service_charge,
                opening: service_charge,
                closing: service_charge,
                status: "Success",
                details: `${user.name},${user.acctype}, Your Nsdl Service has been activated`

            })
            res.status(200).json({
                success: true,
                message: "Your Service Has Been Activated"
            })
        }

    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})

router.post("/nsdlkyc/:user", async (req, res) => {
    try {
        const { type, mode, need, firstname, lastname, gender, dob, mobile, email, pan
        } = req.body
        const order = "KYC" + (Math.floor(Math.random() * (900000000 - 1000000 + 1)) + 1000000).toString();
        const user = await User.findOne({ username: req.params.user })
        const pan_res = await axios.post("https://panonlineservice.com/app/api/nsdl/request", {
            api_key: process.env.Nsdl_API_KEY,
            branch_code: user.username,
            env_mode: "LIVE", // “UAT” FOR TEST | “LIVE” FOR PRODUCTION
            app_type: type, // “NEW” – NEW PAN | “CR” FOR CORRECTION PAN
            app_mode: mode, // “K” – FOR E-KYC | “E” – FOR SCAN BASE APPLICATION
            phyPanIsReq: need, // “Y” FOR Physical Pan Need | for e-Pan only “N”
            redirect_url: "http://localhost:5173/nsdlhistory",
            order_id: order,
            applicant_data: {
                first_name: firstname,
                last_name: lastname,
                gender: gender,
                dob: dob,
                mobile_no: mobile,
                email_id: email,
                pan_no: pan,
            }
        }, { withCredentials: true })
        const usercomm = await Commission.findOne({ userId: user.username });
        const nsdlfee = usercomm.nsdl;


        if (user.wallet < nsdlfee) {
            res.status(500).json({
                success: false,
                message: "please update your wallet"
            })
        } else {
            if (pan_res.data.status === "Success") {
                await NSDL.create({
                    userId: req.params.user,
                    type,
                    mode,
                    need,
                    order,
                    firstname,
                    lastname,
                    gender,
                    dob,
                    mobile,
                    email,
                    pan,
                    ref: pan_res.data.txnid,
                    ack: "",
                    balance: pan_res.data.status === "Success" && user.wallet > nsdlfee ? ~~user.wallet - ~~nsdlfee : user.wallet,
                    status: pan_res.data.status
                })
                await user.updateOne({ wallet: ~~user.wallet - ~~nsdlfee })
                await Wallet.create({
                    userdetails: user.username,
                    txntype: "Pan Submission Commission",
                    amount: nsdlfee,
                    opening: user.wallet,
                    closing: ~~user.wallet - ~~nsdlfee,
                    status: "Success",
                    details: "",
                })
                console.log(pan_res.data)
                res.status(200).json({
                    success: true,
                    message: "Your Pan details are Submitted successfully",
                    form: pan_res.data,

                })
            }

        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something Went Wrong",
            err: error,
        })
    }

})


router.post("/ackgenerate/:user", async (req, res) => {
    try {
        const { order } = req.body
        const txnId = "UNIQTXN" + (Math.floor(Math.random() * (900000000 - 1000000 + 1)) + 1000000).toString();
        const nsdlUser = await NSDL.findOne({ order: order })
        const ack_check = await axios.post("https://panonlineservice.com/app/api/nsdl/transactionStatus", {
            api_key: process.env.Nsdl_API_KEY,
            order_id: order,
            txn_id: txnId,
        }, { withCredentials: true })
        if (!ack_check.data.status) {
            res.status(200).json({
                success: true,
                message: "Error: User Id InActive or Invalid Entries",
            })
        }
        else if (ack_check.data.status === "Failed") {
            res.status(200).json({
                success: true,
                message: "User Id InActive, Contact system administrator",
            })
        } else {
            await nsdlUser.updateOne({ ack: ack_check.data.ack })
            res.status(200).json({
                success: true,
                message: "Ack Number has been Updated, Please Refresh",
                response: ack_check.data.ack
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            response: error
        })
    }
})



router.get("/history/:userid", async (req, res) => {
    try {
        const userhistory = await NSDL.find({ userId: req.params.userid })
        res.status(200).json({
            success: true,
            message: userhistory,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something Went Wrong"
        })
    }
})







export default router