import express from "express"
import { Commission } from "../models/Commison.js";
import { User } from "../models/Users.js";


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


router.post("/addslab/:user", async (req, res) => {
    try {
        const { slab, vodafone, airtel, jio, bsnl, idea, uti, nsdl } = req.body
        const comm = await Commission.create({
            userId: req.params.user,
            slab,
            vodafone,
            jio,
            bsnl,
            airtel,
            idea,
            uti,
            nsdl
        })
        res.status(200).json({
            success: true,
            message: "Slab has been created",
            response: comm
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "something went wrong",
            response: error
        })
    }
})

router.get("/slabs/:user", async (req, res) => {
    try {
        const user = req.params.user
        const slabs = await Commission.find({ userId: user })

        res.status(200).json({
            success: true,
            response: slabs
        })

    } catch (error) {
        console.log(error)
    }
})



// update the slab
router.put("/updateslab/:user", async (req, res) => {
    try {
        const userslab = await Commission.findOne({ userId: req.params.user })
        const updated = await Commission.findByIdAndUpdate({ _id: userslab._id }, { $set: req.body }, { new: true })
        res.status(200).json({
            success: true,
            message: "Slab has been successfully added"
        })
    } catch (error) {
        console.log(error)
    }
})

//


export default router