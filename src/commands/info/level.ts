import Command, { sMessage } from '../../structures/Command'
import Bot from '../../structures/Client'
import {
    MessageEmbed,
    GuildMember,
} from 'discord.js'
import Member from '../../database/models/member'
import Canvacord from 'canvacord'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "level",
            description: "Mostra o level de algum membro do servidor",
            disabled: false,
            aliases: []
        })
    }
    run = async (message: sMessage) => {
        const user = message.mentions.users.first() || message.author
        const member = message.mentions.members.first() as GuildMember || message.member

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        if (user.bot) {
            if (user.id === this.client.user.id) {
                embed.setDescription(`**Meu level é uma incógnita, ou talvez ele só não exista \:thinking:**`)

            } else embed.setDescription(`**${user} é um bot, ${message.author}**`)
            return message.reply({ content: null, embeds: [embed] })
        }
        const mensioned = await Member.findById(message.guild.id + message.author.id) ||
            new Member({
                _id: message.guild.id + message.author.id,
                guildid: message.guild.id,
                usertag: message.author.tag
            })

        mensioned.save()
        const meta = 3 * (mensioned.level ** 2)

        const rank = new Canvacord.Rank()
            .setAvatar(user.displayAvatarURL({
                dynamic: false,
                format: 'png'
            }))
            .setLevel(mensioned.level)
            .setCurrentXP(mensioned.xp)
            .setBackground("COLOR", "#464e4e")
            .setRank(0)
            .setRequiredXP(meta)
            .setProgressBar(member.displayHexColor, "COLOR")
            .setUsername(user.username)
            .setDiscriminator(user.discriminator)
        rank.build({}).then(data => {
            message.reply({ content: null, files: [data] })
        })
    }
}
