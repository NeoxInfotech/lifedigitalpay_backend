import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    slab: {
        type: String,
        default: "Default",
    },
    vodafone: {
        type: Number,
        default: 2,
    },
    jio: {
        type: Number,
        default: 3,
    },
    bsnl: {
        type: Number,
        default: 2,
    },
    airtel: {
        type: Number,
        default: 2,
    },
    idea: {
        type: Number,
        default: 1,
    },
    uti: {
        type: Number,
        default: 65,
    },
    nsdl: {
        type: Number,
        default: 90
    }
}, { timestamps: true })

export const Commission = mongoose.model("Commission", commissionSchema)