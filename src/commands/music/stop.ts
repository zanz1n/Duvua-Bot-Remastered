import Command, { sMessage } from '../../structures/Command'
import Bot from '../../structures/Client'
import {
    Permissions,
    MessageEmbed
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
        const queue = this.client.player.getQueue(message.guild.id)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (!message.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando, ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })
        } else {
            if (!queue) {
                embed.setDescription(`**Não há nenhum som na fila,  ${message.author}}**`)
                return await message.reply({ content: null, embeds: [embed] })
            }
            queue.destroy()
            embed.setDescription(`**A fila foi limpa por ${message.author}**`)
            return await message.reply({ content: null, embeds: [embed] })
        }
    }
}
