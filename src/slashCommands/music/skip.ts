import slashCommand, { sInteraction } from "../../structures/slashCommand"
import Bot from "../../structures/Client"
import {
    MessageEmbed,
    Permissions
} from "discord.js"

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "skip",
            description: "Pula a música que está tocando",
            ephemeral: false,
            disabled: false,
        })
    }
    run = async (interaction: sInteraction) => {
        const queue = this.client.player.getQueue(interaction.guildId)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (!queue) {
            embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }

        if (interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS) || interaction.user === queue.current.requestedBy) {
            queue.skip()

            embed.setDescription(`**Música** ${queue.current.title} **pulada por ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        } else {
            embed.setDescription(`**Você não pode pular uma música que não solicitou, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
    }
}
