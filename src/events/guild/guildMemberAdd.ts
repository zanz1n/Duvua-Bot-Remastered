import Event from '../../structures/Event'
import Bot from '../../structures/Client'
import guild from '../../database/models/guild'
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js'

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "guildMemberAdd"
        })
    }
    run = async (member: GuildMember) => {
        const guilDb = await guild.findById(member.guild.id) ||
            new guild({ _id: member.guild.id, name: member.guild.name })

        const channel = member.guild.channels.cache.get(guilDb.wellcome.channel) as TextChannel

        if (!channel) return
        if (!guilDb.wellcome.enabled) return

        const embed = new MessageEmbed().setTitle(`Wellcome ${member.user.username}`).setThumbnail(member.displayAvatarURL()).setDescription(guilDb.wellcome.message)
        channel.send({ embeds: [embed] })
    }
}
