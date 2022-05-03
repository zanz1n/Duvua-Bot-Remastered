import slashCommand, { sInteraction } from '../../structures/slashCommand'
import { MessageEmbed, MessageActionRow, MessageButton, Permissions } from 'discord.js'
import Bot from '../../structures/Client'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "ping",
            description: "Mostra o ping do bot e responde com pong",
            disabled: false,
            ephemeral: true
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        embed.setDescription(`**Pong!**\nPing do bot: ${this.client.ws.ping} ms`)
        interaction.editReply({ content: null, embeds: [embed] })
    }
}
