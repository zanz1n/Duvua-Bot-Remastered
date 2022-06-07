import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    Interaction,
    Permissions
} from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "say",
            description: "Eu falo o que você me pedir [\\n para qubra de linha]",
            ephemeral: false,
            disabled: false,
            options: [
                {
                    name: "message",
                    description: "O que você quer que eu fale",
                    type: 3,
                    required: true
                }
            ]
        })
    }
    run = async (interaction: Interaction) => {
        if (!(interaction.isCommand() &&
            (interaction.deferred || interaction.replied))) return

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user.username}**`)
            return await interaction.editReply({ embeds: [embed] })
        }

        const message = interaction.options.getString('message') as string

        const content = message.split("\\n").join("\n")
        await interaction.editReply({ content: `${content}\n-${interaction.user}` })
    }
}
