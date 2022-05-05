import slashCommand, { sInteraction } from "../../structures/slashCommand"
import Bot from "../../structures/Client"
import {
    MessageEmbed,
    Permissions
} from "discord.js"

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "stop",
            description: "Para o bot e limpa a fila de reprodução",
            disabled: false,
            aliases: ['st']
        })
    }
    run = async (interaction: sInteraction) => {
        const queue = this.client.player.getQueue(interaction.guildId)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        if (!interaction.memberPermissions.has(Permissions.FLAGS.MOVE_MEMBERS)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
        if (!queue) {
            embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }

        queue.destroy()

        embed.setDescription(`**A fila foi limpa por ${interaction.user}**`)
        await interaction.editReply({ content: null, embeds: [embed] })
    }
}
