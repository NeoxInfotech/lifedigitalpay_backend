import express from "express"
const router = express.Router()

import axios from "axios"
import { User } from "../models/Users.js";
import { Commission } from "../models/Commison.js";
import { UTI } from "../models/UTI.js";
import { Wallet } from "../models/Wallet.js";






router.post("/onboard/:user", async (req, res) => {
    try {
        const service_cost = 100;
        const partner = await User.findOne({ username: req.params.user })
        const p_utirate = await Commission.findOne({ userId: req.params.user })

        const activation_price = ~~service_cost + ~~p_utirate.uti

        if (partner.wallet < activation_price) {
            res.status(500).json({
                success: false,
                message: "Please Update Your Wallet"
            })
        } else {
            const post_uti = await axios.post("https://panonlineservice.com/app/api/agent/onbording", {
                token: "QVQxNzE1Njc5NzQ5MzAyNDQ2NzA5",
                name: partner.name,
                agent_id: partner.username,
                mobile: partner.mobile,
                email_id: partner.email,
                address: partner.address,
                state: partner.state,
                city: partner.state,
                pincode: partner.pincode,
                pan_no: partner.pan,
                addhaar_no: partner.adhaar
            }, { withCredentials: true })
            if (post_uti.data.status === "Failed") {
                await UTI.create({
                    userId: partner.username,
                    name: partner.name,
                    agentId: partner.username,
                    mobile: partner.mobile,
                    email_id: partner.email,
                    address: partner.address,
                    state: partner.state,
                    city: partner.city,
                    pincode: partner.pincode,
                    pan_no: partner.pan,
                    addhaar_no: partner.adhaar,
                    balance: partner.wallet,
                    status: "Failure"
                })
                res.status(200).json({
                    success: true,
                    message: "Failed to submit the documents, please try again"
                })
            } else {
                await partner.updateOne({ wallet: ~~partner.wallet - ~~activation_price });
                await UTI.create({
                    userId: partner.username,
                    name: partner.name,
                    agentId: partner.username,
                    mobile: partner.mobile,
                    email_id: partner.email,
                    address: partner.address,
                    state: partner.state,
                    city: partner.city,
                    pincode: partner.pincode,
                    pan_no: partner.pan,
                    addhaar_no: partner.adhaar,
                    balance: partner.wallet,
                    status: "Success"
                })
                await partner.updateOne({ utiactive: true })
                // TODO: Need to create a wallet here
                res.status(200).json({
                    success: true,
                    message: "Submitted Successfully",
                    response: post_uti.data
                })
            }
        }

    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})


router.post("/utilogin/:user", async (req, res) => {
    try {
        const partner = await User.findOne({ username: req.params.user })
        const uti_login = await axios.post("https://panonlineservice.com/app/api/uti/login", {
            token: "QVQxNzE1Njc5NzQ5MzAyNDQ2NzA5",
            agent_id: partner.username,
            req_type: "UAT"
        }, { withCredentials: true })
        const utipartner = await UTI.findOne({ userId: partner.username })
        await utipartner.updateOne({ url: uti_login.data.url })
        res.status(200).json({
            success: true,
            response: uti_login.data,
            url: uti_login.data.url,
            message: "Login Link has been Provided"
        })
    } catch (error) {
        res.status(500).json(error)
    }
})



router.post("/onboardauser/:user", async (req, res) => {
    try {
        const { name, mobile, email, address, state, city, pincode, pan, adhaar } = req.body
        const partner = await User.findOne({ username: req.params.user })
        const order = "KYC" + (Math.floor(Math.random() * (9000000 - 10000 + 1)) + 10000).toString();
        const p_utirate = await Commission.findOne({ userId: req.params.user })
        const activation_price = ~~p_utirate.uti

        if (partner.wallet < activation_price) {
            res.status(500).json({
                success: false,
                message: "Please Update Your Wallet"
            })
        } else {
            const post_uti = await axios.post("https://panonlineservice.com/app/api/agent/onbording", {
                token: "QVQxNzE1Njc5NzQ5MzAyNDQ2NzA5",
                name: name,
                agent_id: order,
                mobile: mobile,
                email_id: email,
                address: address,
                state: state,
                city: city,
                pincode: pincode,
                pan_no: pan,
                addhaar_no: adhaar
            }, { withCredentials: true })
            if (post_uti.data.status === "Failed") {
                await UTI.create({
                    userId: partner.username,
                    name: name,
                    agentId: order,
                    mobile: mobile,
                    email_id: email,
                    address: address,
                    state: state,
                    city: city,
                    pincode: pincode,
                    pan_no: pan,
                    addhaar_no: adhaar,
                    balance: partner.wallet,
                    status: "Failure"
                })
                res.status(500).json({
                    success: true,
                    message: "Failed to submit the documents, please try again",
                    response: post_uti.data,
                })
            } else {
                await partner.updateOne({ wallet: ~~partner.wallet - ~~activation_price });
                await UTI.create({
                    userId: partner.username,
                    name: name,
                    agentId: order,
                    mobile: mobile,
                    email_id: email,
                    address: address,
                    state: state,
                    city: city,
                    pincode: pincode,
                    pan_no: pan,
                    addhaar_no: adhaar,
                    balance: partner.wallet,
                    status: "Success"
                })
                await partner.updateOne({ utiactive: true })
                await Wallet.create({
                    userdetails: partner.username,
                    txntype: "UTI KYC Charge",
                    amount: partner.wallet,
                    opening: ~partner.wallet + ~activation_charge,
                    closing: ~partner.wallet - ~activation_charge,
                    comm: ~~activation_charge,
                    status: "Success",
                    details: "Sucessdully submitted"
                })
                res.status(200).json({
                    success: true,
                    message: "Submitted Successfully",
                    order: order,
                    response: post_uti.data
                })
            }
        }

    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})



router.post("/utiloginuser/:agent", async (req, res) => {
    try {
        const partner = await UTI.findOne({ agentId: req.params.agent })
        const uti_login = await axios.post("https://panonlineservice.com/app/api/uti/login", {
            token: "QVQxNzE1Njc5NzQ5MzAyNDQ2NzA5",
            agent_id: partner.agentId,
            req_type: "UAT"
        }, { withCredentials: true })
        await partner.updateOne({ url: uti_login.data.url })
        res.status(200).json({
            success: true,
            response: uti_login.data,
            url: uti_login.data.url,
            message: "Login Link has been Provided"
        })
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})




router.get("/utihistory/:user", async (req, res) => {
    try {
        const uti_kyc = await UTI.find({ userId: req.params.user })
        res.status(200).json({
            success: true,
            response: uti_kyc
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            response: error,
        })
    }
})





export default router