import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    pincode: {
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
    state: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    adhaar: {
        type: String,
        required: true,
    },
    pan: {
        type: String,
        required: true,
    },
    acctype: {
        type: String,
        required: true,
    },
    accprice: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
    wallet: {
        type: Number,
        default: 0,
    },
    under: {
        type: String,
        default: "admin"
    },
    nsdlactive: {
        type: Boolean,
        default: false,
    },
    utiactive: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })


export const User = mongoose.model("User", usersSchema)