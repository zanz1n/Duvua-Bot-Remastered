import Event from '../../structures/Event'
import Bot from '../../structures/Client'
import guild from '../../database/models/guild'
import {
    GuildMember,
    MessageEmbed,
    TextChannel,
    ColorResolvable
} from 'discord.js'
import Canvacord from 'canvacord'

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "guildMemberAdd"
        })
    }
    run = async (member: GuildMember) => {
        let guilDb = await guild.findById(member.guild.id)
        if (!guilDb) {
            guilDb = new guild({ _id: member.guild.id, name: member.guild.name })
            await guilDb.save()
        }

        const channel = member.guild.channels.cache.get(guilDb.wellcome.channel) as TextChannel

        if (!channel) return
        if (!guilDb.wellcome.enabled) return

        const type = guilDb.wellcome.type
        if (type === 'embed') {
            const embed = new MessageEmbed()
                .setTitle(`Wellcome ${member.user.username}`)
                .setThumbnail(member.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setDescription(guilDb.wellcome.message)
            channel.send({ embeds: [embed] })
        } else if (type === 'message') {
            channel.send(`${member}, ${guilDb.wellcome.message}`)
        } else if (type === 'image') {
            const welcomeImage: any = new Canvacord.Welcomer()

            const color: ColorResolvable = '#8814fc'
            const textColor: ColorResolvable = '#f1f1f1'

            welcomeImage.setAvatar(member.user.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setUsername(member.user.username)
                .setDiscriminator(member.user.discriminator)
                .setGuildName(member.guild.name)
                .setMemberCount(member.guild.memberCount)
                .setBackground('https://izan.studio/assets/wellcome_01.png')
                .setText("title", "Bem Vindo")
                .setColor("border", color)
                .setColor("username-box", color)
                .setColor("discriminator-box", color)
                .setColor("message-box", color)
                .setColor("title", textColor)
                .setColor("username", textColor)
                .setColor("message", textColor)
                .setColor("discriminator", textColor)
                .setColor("avatar", color)
                .setText("message", guilDb.wellcome.message)
                .setText("member-count", `${member.guild.memberCount}° membro!`)

            const image = await welcomeImage.build()

            await channel.send({ content: `${member.user}`, files: [image] })
        }
    }
}
