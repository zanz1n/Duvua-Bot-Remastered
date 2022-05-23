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
        const player = this.client.manager.get(interaction.guild.id)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (!player || !player.queue.current) {
            embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }

        const tracks = player.queue.slice(0, player.queue.size)

        function getRequesterMention(track: any) {
            return `<@${track.requester.id}>`
        }
        const queueString = tracks.map((track, i) =>
            `${0 + (++i)} - [${this.client.parseMsIntoFormatData(track.duration)}] - ` +
            `${getRequesterMention(track)} - [${track.title}](${track.uri})`).join("\n")

        const currentSong = player.queue.current
        const formatedDuration = this.client.parseMsIntoFormatData(currentSong.duration)

        const requester: any = currentSong.requester

        embed.setDescription("**Tocando**\n" +
            (currentSong ? `[${formatedDuration}] - <@${requester.id}> - [${currentSong.title}](${currentSong.uri})` : null) +
            `\n\n**Lista**\n${queueString}`
        ).setFooter({
            text: `Requisitado por ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
        }).setThumbnail(currentSong.thumbnail)

        interaction.editReply({ content: null, embeds: [embed] })
    }
}
