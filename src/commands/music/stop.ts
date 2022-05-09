import Command, { sMessage } from '../../structures/Command'
import Bot from '../../structures/Client'
import {
    Permissions,
    MessageEmbed
} from 'discord.js'
import Member from '../../database/models/member'

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
        const memberDb = await Member.findById(guild.id + author.id) ||
            new Member({
                _id: guild.id + author.id,
                guildid: guild.id,
                userid: author.id,
                usertag: author.tag
            })
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
