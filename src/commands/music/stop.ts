import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    Permissions,
} from 'discord.js'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "stop",
            description: "Para o bot e limpa a fila de reprodução",
            disabled: false,
            aliases: ['st']
        })
    }
    run = async (message: sMessage) => {
        const { guild, author } = message
        const queue = this.client.player.getQueue(message.guild.id)
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (!queue) {
            embed.setDescription(`**Não há nenhum som na fila,  ${message.author}}**`)
            return await message.reply({ content: null, embeds: [embed] })
        }
        const memberDb = await this.client.db.getMemberDbFromMember(message.member)

        if (message.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS) || memberDb.dj) {
            queue.destroy()
            embed.setDescription(`**A fila foi limpa por ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })
        } else {
            embed.setDescription(`**Você não tem permissão para usar esse comando, ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })
        }
    }
}
