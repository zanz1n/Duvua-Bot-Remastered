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
        const player = this.client.manager.get(message.guild.id)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const memberDb = await this.client.db.getMemberDbFromMember(message.member)

        if (!player || !player.queue.current) {
            embed.setDescription(`**Não há nenhum som na fila,  ${message.author}**`)
            return message.reply({ content: null, embeds: [embed] })
        }

        if (message.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS) || memberDb.dj) {
            player.destroy()

            embed.setDescription(`**A fila foi limpa por ${message.author}**`)
            await message.reply({ content: null, embeds: [embed] })
        } else {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })
        }
    }
}
