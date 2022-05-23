import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
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
        const player = this.client.manager.get(interaction.guild.id)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const memberDb = await this.client.db.getMemberDbFromMember(interaction.member)

        if (!player || !player.queue.current) {
            embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }

        const requester: any = player.queue.current.requester

        if (interaction.memberPermissions.has(Permissions.FLAGS.MOVE_MEMBERS) ||
            interaction.user.id === requester.id || memberDb.dj) {
            embed.setDescription(`**Música** ${player.queue.current.title} **pulada por ${interaction.user}**`)

            if (player.queue.size < 1) {
                player.destroy()
            } else {
                player.stop()
            }

            return await interaction.editReply({ content: null, embeds: [embed] })
        } else {
            embed.setDescription(`**Você não pode pular uma música que não solicitou, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
    }
}
