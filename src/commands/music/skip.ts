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
        const player = this.client.manager.get(message.guild.id)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const memberDb = await this.client.db.getMemberDbFromMember(message.member)

        if (!player || !player.queue.current) {
            embed.setDescription(`**Não há nenhum som na fila,  ${message.author}**`)
            return message.reply({ content: null, embeds: [embed] })
        }

        const requester: any = player.queue.current.requester

        if (message.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS) ||
        message.author.id === requester.id || memberDb.dj) {
            embed.setDescription(`**Música** ${player.queue.current.title} **pulada por ${message.author}**`)

            if (player.queue.size < 1) {
                player.destroy()
            } else {
                player.stop()
            }

            return await message.reply({ content: null, embeds: [embed] })
        } else {
            embed.setDescription(`**Você não pode pular uma música que não solicitou, ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })
        }
    }
}
