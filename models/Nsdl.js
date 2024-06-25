import mongoose from "mongoose";


const nsdlSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        required: true,
    },
    need: {
        type: String,
        required: true,
    },
    order: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    pan: {
        type: String,
    },
    ref: {
        type: String,
    },
    ack: {
        type: String
    },
    balance: {
        type: Number,
    },
    status: {
        type: String
    }
}, { timestamps: true })




export const NSDL = mongoose.model("Nsdl", nsdlSchema)