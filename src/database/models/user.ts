import mongoose, { Schema } from 'mongoose'

let userSchema = new Schema({
    _id: { type: String },
    usertag: { type: String },
    last_daily_request: { type: Number, default: Date.now() - 10800000 },
    job: { type: String, default: "mendigo" },
    gold_coins: { type: Number, default: 0 }
})

export default mongoose.model("user", userSchema)
