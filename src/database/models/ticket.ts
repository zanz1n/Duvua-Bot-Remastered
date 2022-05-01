import mongoose, { Schema } from "mongoose"

let ticketSchema = new Schema({
    _id: { type: String },
    user: {
        id: { type: String },
        tag: { type: String }
    },
    opened: { type: Boolean },
    guildId: { type: String },
    channel: {
        id: { type: String },
        name: { type: String }
    },
})

export default mongoose.model("ticket", ticketSchema)
