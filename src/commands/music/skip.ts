import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    Permissions
} from 'discord.js'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "skip",
            description: "Pula a música que está tocando",
            disabled: false,
            aliases: ['sk']
        })
    }
    run = async (message: sMessage) => {
        const { guild, author } = message
        const queue = this.client.player.getQueue(message.guild.id)
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (!queue) {
            embed.setDescription(`**Não há nenhum som na fila,  ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })
        }
        const memberDb = await this.client.db.getMemberDbFromMember(message.member)

        const currentSong = queue.current
        if (message.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS) ||
            message.author.id === currentSong.requestedBy.id || memberDb.dj) {
            queue.skip()
            embed.setDescription(`**Música** ${queue.current.title} **pulada por ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })

        } else {
            embed.setDescription(`**Você não pode pular uma música que não solicitou, ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })
        }
    }
}
