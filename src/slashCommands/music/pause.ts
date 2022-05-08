import slashCommand, { sInteraction } from "../../structures/slashCommand"
import Bot from "../../structures/Client"
import {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Permissions
} from "discord.js"

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "pause",
            description: "Pausa a reprodução do bot",
            ephemeral: false,
            disabled: false,
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

        queue.setPaused(true)

        const resume = new MessageButton()
            .setCustomId('resume')
            .setEmoji(`▶️`)
            .setLabel('Resume')
            .setStyle('SUCCESS')
        const button = new MessageActionRow().addComponents(resume)
        embed.setDescription(`**Fila pausada por ${interaction.user}**\nUse /resume para continuar a reprodução`)
        await interaction.editReply({ content: null, embeds: [embed], components: [button] })
    }
}
