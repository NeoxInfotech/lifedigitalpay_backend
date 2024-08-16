import cookieParser from "cookie-parser";
import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import authRouter from "./routes/auth.js"
import userRouter from "./routes/user.js"
import rechargeRouter from "./routes/recharge.js"
import walletRouter from "./routes/wallet.js"
import commissionRouter from "./routes/commission.js"
import nsdlRouter from "./routes/nsdl.js"
import utiRouter from "./routes/uti.js"
import cors from "cors"
const app = express();


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))


// **Middlewares
dotenv.config()
app.use(cookieParser())
app.use(express.json())
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/recharge", rechargeRouter)
app.use("/api/v1/wallet", walletRouter)
app.use("/api/v1/commission", commissionRouter)
app.use("/api/v1/nsdl", nsdlRouter)
app.use("/api/v1/uti", utiRouter)



const ConnectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: "LifeDigiPayDatabase" });
        console.log("Database has been connected successfully")
    } catch (error) {
        console.log(error)
    }
}








app.get("/", (req, res) => {
    res.send("App running successfully")
})




app.listen(process.env.PORT, () => {
    ConnectDb();
    console.log("Listining on 8000")
})


// const dateObj = new Date();
// const month = dateObj.getMonth() + 1; // months from 1-12
// const day = dateObj.getDate();
// const year = dateObj.getFullYear();





// // Using padded values, so that 2023/1/7 becomes 2023/01/07
// const pMonth = month.toString().padStart(2, "0");
// const pDay = day.toString().padStart(2, "0");
// const newPaddedDate = `${year}/${pMonth}/${pDay}`;

// console.log(newPaddedDate)