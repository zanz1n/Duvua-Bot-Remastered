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
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        const queue = this.client.player.getQueue(message.guild.id)

        if (!queue) {
            embed.setDescription(`**Não há nenhum som na fila, ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })
        } else {
            const queueString = queue.tracks.join("\n")
            const currentSong = queue.current

            embed.setDescription("**Tocando**\n" +
                (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : null) +
                `\n\n**Lista**\n${queueString}`)
                .setFooter({ text: `Requisitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() }).setTimestamp()
                .setThumbnail(currentSong.thumbnail)

            await message.reply({ content: null, embeds: [embed] })
        }
    }
}
