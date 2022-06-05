import { config } from "../../botconfig"
import { connect } from "mongoose"
import { GuildMember } from "discord.js"
import { Models } from "./Models"

class methodTypes {
    //type the methods
}

export class Database {

    public models = Models

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
