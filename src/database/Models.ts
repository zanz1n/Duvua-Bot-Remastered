import { Schema, model } from "mongoose"

export const Models = {

    Guild: model("guild", new Schema({
        _id: { type: String },
        name: { type: String },
        prefix: { type: String, default: "-" },
        enable_ticket: { type: Boolean, default: true },
        stric_music_mode: { type: Boolean, default: false },
        wellcome: {
            channel: { type: String, default: "na" },
            message: { type: String, default: "Seja bem vindo ao servidor" },
            enabled: { type: Boolean, default: false },
            type: { type: String, default: 'message' }
        }
    })),

    Ticket: model("ticket", new Schema({
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
    })),

    Member: model("member", new Schema({
        _id: { type: String },
        guildid: { type: String },
        userid: { type: String },
        usertag: { type: String },
        silver_coins: { type: Number, default: 0 },
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        dj: { type: Boolean, default: false },
        allowed_to_play: { type: Boolean, default: false },
    })),

    User: model("user", new Schema({
        _id: { type: String },
        usertag: { type: String },
        last_daily_request: { type: Number, default: Date.now() - 10800000 },
        job: { type: String, default: "mendigo" },
        gold_coins: { type: Number, default: 0 }
    }))
}
