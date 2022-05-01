import slashCommand, { sInteraction } from '../../structures/slashCommand'
import { MessageEmbed, MessageActionRow, MessageButton, Permissions } from 'discord.js'
import Bot from '../../structures/Client'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "ping",
            description: "Shows the bot ping and replies with pong",
            disabled: false,
            ephemeral: false
        })
    }
    run = async (interaction: sInteraction) => {
        const button = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('yes').setLabel('Sim').setStyle('SUCCESS'),
            new MessageButton().setCustomId('no').setLabel('No').setStyle('DANGER')
        )
        interaction.editReply({ components: [button] })
    }
}
