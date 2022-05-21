import { Schema, model } from "mongoose"
import { config } from "../../botconfig"
import { sInteraction } from "../types/Interaction"
import { sMessage } from "../types/Message"
import { connect } from "mongoose"
import { GuildMember, Interaction, User } from "discord.js"

class methodTypes {
    //type the methods
}

export class Database {

    public models = {

        Guild: model("guild", new Schema({
            _id: { type: String },
            name: { type: String },
            prefix: { type: String, default: "-" },
            enable_ticket: { type: Boolean, default: true },
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
        })),

        User: model("user", new Schema({
            _id: { type: String },
            usertag: { type: String },
            last_daily_request: { type: Number, default: Date.now() - 10800000 },
            job: { type: String, default: "mendigo" },
            gold_coins: { type: Number, default: 0 }
        }))
    }

    public connectToDatabase = async () => {
        connect(config.mongodb_url, {
            autoIndex: false,
            keepAlive: true
        }, (err) => {
            if (err) {
                console.log(config.logs.bot_error("Failed to connect to MongoDB\n"), `${err.name}\n`, err.message)
                process.exit(1)
            } else {
                console.log(config.logs.bot("Connected to MongoDB"))
            }
        })
    }

    public getGuildDbFromMember = async (member: GuildMember | any) => {
        const { guild } = member

        return await this.models.Guild.findById(guild.id) ||
            await new this.models.Guild({
                _id: guild.id,
                name: guild.name
            })
    }

    public getTicketDbFromMember = async (member: GuildMember | any) => {
        const { guild, user } = member

        return await this.models.Ticket.findById(guild.id + user.id) ||
            await new this.models.Ticket({
                _id: guild.id + user.id,
                user: {
                    id: user.id,
                    tag: user.tag
                },
                opened: false,
                guildId: guild.id
            })
    }

    public getUserDbFromMember = async (member: GuildMember | any) => {
        const { user } = member

        return await this.models.User.findById(user.id) ||
            await new this.models.User({
                _id: user.id,
                usertag: user.tag
            })
    }

    public getMemberDbFromMember = async (member: GuildMember | any) => {
        const { user, guild } = member

        return await this.models.Member.findById(guild.id + user.id) ||
            await new this.models.Member({
                _id: guild.id + user.id,
                guildid: guild.id,
                userid: user.id,
                usertag: user.tag,
            })
    }

    public findGuildDbFromMember = async (member: GuildMember | any) => {
        const { guild } = member
        return await this.models.Guild.findById(guild.id)
    }

    public findTicketDbFromMember = async (member: GuildMember | any) => {
        const { guild, user } = member
        return await this.models.Ticket.findById(guild.id + user.id)
    }

    public findUserDbFromMember = async (member: GuildMember | any) => {
        const { user } = member
        return await this.models.User.findById(user.id)
    }

    public findMemberDbFromMember = async (member: GuildMember | any) => {
        const { user, guild } = member
        return await this.models.Member.findById(guild.id + user.id)
    }

}
