import mongoose, { Schema } from 'mongoose'

let guildSchema = new Schema({
    _id: { type: String },
    name: { type: String },
    prefix: { type: String, default: "-" },
    wellcome: {
        channel: { type: String, default: "na" },
        message: { type: String, default: "Seja bem vindo ao servidor" },
        enabled: { type: Boolean, default: false },
    }
})

export default mongoose.model("guild", guildSchema)
