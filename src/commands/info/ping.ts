import Command, { sMessage } from '../../structures/Command'
import Bot from '../../structures/Client'
import {
    MessageEmbed
} from 'discord.js'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "ping",
            disabled: false,
            aliases: [],
        })
    }
    run = async (message: sMessage) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        embed.setDescription(`**Pong!**\nPing do bot: ${this.client.ws.ping} ms`)
        message.reply({ embeds: [embed] })
    }
}