import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    userdetails: {
        type: String,
    },
    txntype: {
        type: String,
    },
    amount: {
        type: Number,
    },
    opening: {
        type: Number,
    },
    closing: {
        type: Number,
    },
    status: {
        type: String,
    },
    details: {
        type: String,
    },
}, { timestamps: true })


export const Wallet = mongoose.model("Wallet", walletSchema)