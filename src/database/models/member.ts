import mongoose, { Schema } from 'mongoose'

let memberSchema = new Schema({
    _id: { type: String },
    guildid: { type: String },
    userid: { type: String },
    usertag: { type: String },
    silver_coins: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
})

export default mongoose.model("member", memberSchema)
