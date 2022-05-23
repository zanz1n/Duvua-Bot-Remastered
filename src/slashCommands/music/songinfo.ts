import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    MessageActionRow,
    MessageButton
} from "discord.js"

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "songinfo",
            description: "Mostra o som que está tocando",
            ephemeral: false,
            disabled: false,
        })
    }
    run = async (interaction: sInteraction) => {
        const player = this.client.manager.get(interaction.guild.id)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (!player || !player.queue.current) {
            embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
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

        embed.setDescription(`${interaction.user}\n\n` +
            `Tocando agora: **[${song.title}](${song.uri})**\n\n**` +
            `Duração: [${formatData}]**`)
            .setThumbnail(song.displayThumbnail('default'))

        await interaction.editReply({ content: null, embeds: [embed], components: [button] })
    }
}
