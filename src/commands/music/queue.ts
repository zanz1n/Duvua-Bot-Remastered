import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "queue",
            description: "Exibe o som que está tocando na fila",
            disabled: false,
            aliases: ['qu']
        })
    }
    run = async (message: sMessage) => {
        const player = this.client.manager.get(message.guild.id)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (!player || !player.queue.current) {
            embed.setDescription(`**Não há nenhum som na fila,  ${message.author}**`)
            return message.reply({ content: null, embeds: [embed] })
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
            text: `Requisitado por ${message.author.username}`,
            iconURL: message.author.displayAvatarURL()
        }).setThumbnail(currentSong.thumbnail)

        message.reply({ content: null, embeds: [embed] })
    }
}
