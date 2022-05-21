import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "queue",
            description: "Exibe o som que está tocando na fila",
            ephemeral: false,
            disabled: false,
        })
    }
    run = async (interaction: sInteraction) => {
        const queue = this.client.player.getQueue(interaction.guildId)
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (!queue || !queue.playing) {
            embed.setDescription(`**Não há nenhum som na fila**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }

        const queueString = queue.tracks.join("\n")
        const currentSong = queue.current

        embed.setDescription("**Tocando**\n" +
            (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : null) +
            `\n\n**Lista**\n${queueString}`
        )
            .setFooter({ text: `Requisitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }).setTimestamp()
            .setThumbnail(currentSong.thumbnail)

        interaction.editReply({ content: null, embeds: [embed] })
    }
}
