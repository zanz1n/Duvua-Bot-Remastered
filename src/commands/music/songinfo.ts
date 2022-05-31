import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    MessageActionRow,
    MessageButton,
    Permissions,
} from 'discord.js'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "songinfo",
            description: "Mostra o som que está tocando",
            disabled: false,
            aliases: ['song']
        })
    }
    run = async (message: sMessage) => {
        const player = this.client.manager.get(message.guild.id)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (!player || !player.queue.current) {
            embed.setDescription(`**Não há nenhum som na fila,  ${message.member.user}**`)
            return message.reply({ content: null, embeds: [embed] })
        }

        const song = player.queue.current

        const skip = new MessageButton()
            .setCustomId(`skip`)
            .setEmoji(`⏭️`)
            .setLabel('Skip')
            .setStyle('PRIMARY')
        const stop = new MessageButton()
            .setCustomId(`stop`)
            .setEmoji(`⏹️`)
            .setLabel('Stop')
            .setStyle('DANGER')
        const pause = new MessageButton()
            .setCustomId(`pause`)
            .setEmoji(`⏸️`)
            .setLabel('Pause')
            .setStyle('PRIMARY')
        const resume = new MessageButton()
            .setCustomId(`resume`)
            .setEmoji(`▶️`)
            .setLabel('Resume')
            .setStyle('SUCCESS')

        const button = new MessageActionRow().addComponents(skip, stop, pause, resume)

        const formatData = this.client.parseMsIntoFormatData(song.duration)

        embed.setDescription(`${message.member.user}\n\n` +
            `Tocando agora: **[${song.title}](${song.uri})**\n\n**` +
            `Duração: [${formatData}]**`)
            .setThumbnail(song.displayThumbnail('default'))

        await message.reply({ content: null, embeds: [embed], components: [button] })
    }
}
