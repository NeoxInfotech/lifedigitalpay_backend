import mongoose from "mongoose";

const rechargeSchema = new mongoose.Schema({
    userdetails: {
        type: String,
    },
    orderId: {
        type: String,
    },
    number: {
        type: String,
    },
    operator: {
        type: String,
    },
    amount: {
        type: String,
    },
    balance: {
        type: String,
    },
    refid: {
        type: String,
    },
    response: {
        type: String,
    },
    status: {
        type: String,
    },
    userId: {
        type: String,
    },
    txnId: {
        type: String,
    },
}, { timestamps: true })


export const Recharge = mongoose.model("Recharge", rechargeSchema)