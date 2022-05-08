import slashCommand, { sInteraction } from "../../structures/slashCommand"
import Bot from "../../structures/Client"
import {
    MessageEmbed,
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
        const queue = this.client.player.getQueue(interaction.guildId)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (!queue) {
            embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }

        let bar = queue.createProgressBar({
            length: 19
        })

        const song = queue.current
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

        embed.setThumbnail(song.thumbnail).setDescription(`**${interaction.user}**\n\nTocando agora: [${song.title}](${song.url})\n\n**Duração: [${song.duration}]**\n\n ${bar}`)

        await interaction.editReply({ content: null, embeds: [embed], components: [button] })
    }
}
