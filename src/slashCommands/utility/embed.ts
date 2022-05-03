import slashCommand, { sInteraction } from "../../structures/slashCommand"
import Bot from "../../structures/Client"
import {
    MessageEmbed,
    Permissions
} from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "embed",
            description: "Faço uma embed com o que me disser",
            ephemeral: false,
            disabled: false,
            options: [
                {
                    name: "message",
                    description: "O que você quer que eu fale ~/n para quebrar linha~",
                    type: 3,
                    required: true
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user.username}**`)
            return await interaction.editReply({ embeds: [embed] })
        }
        if (interaction.options.getString('content') === "" || undefined) {
            embed.setDescription("**Você precisa inserir algo na embed**")
            return await interaction.editReply({ embeds: [embed] })
        }

        embed.setDescription(interaction.options.getString('content'))
            .setFooter({ text: `Mensagem de ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }).setTimestamp()
        await interaction.editReply({ embeds: [embed] })
    }
}
