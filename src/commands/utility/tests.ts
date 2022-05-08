import Command, { sMessage } from '../../structures/Command'
import Bot from '../../structures/Client'
import {
    TextChannel,
    ColorResolvable,
    MessageEmbed,
    Permissions
} from 'discord.js'
import guild from '../../database/models/guild'
import Canvacord from 'canvacord'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "test",
            description: "tests the bot",
            disabled: false,
            aliases: ['tw'],
        })
    }
    run = async (message: sMessage) => {
        const embed = new MessageEmbed()

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando, ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })
        }
        const { member } = message

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
            embed.setTitle(`Bem vindo ${member.user.username}`)
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