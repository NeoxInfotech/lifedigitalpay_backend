import express from "express"
import { Commission } from "../models/Commison.js";


const router = express.Router();


router.get("/getcommission/:user", async (req, res) => {
    try {
        const comm = await Commission.findOne({ userId: req.params.user })
        res.status(200).json({
            success: true,
            message: comm
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error,
            message: "Somthing Went Wrong"

        })
    }
})


router.put("/updatemargin/:user", async (req, res) => {
    try {
        const { uti, nsdl } = req.body
        const comm = await Commission.findOne({ userId: req.params.user })

        const updated = await comm.updateOne({ uti, nsdl })
        res.status(200).json({
            success: true,
            message: "margins has been successfully set",
            response: updated
        })
    } catch (error) {

    }
})


export default router