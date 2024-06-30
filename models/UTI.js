import mongoose from "mongoose"

const utiSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String
    },
    agentId: {
        type: String
    },
    mobile: {
        type: String
    },
    email_id: {
        type: String
    },
    address: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String

    },
    pincode: {
        type: String
    },
    pan_no: {
        type: String
    },
    aadhaar_no: {
        type: String
    },
    balance: {
        type: String
    },
    status: {
        type: String
    },
    url: {
        type: String
    }
}, { timestamps: true })


export const UTI = mongoose.model("UTI", utiSchema)


