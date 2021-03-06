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
            name: "stop",
            description: "Para o bot e limpa a fila de reprodução",
            disabled: false,
            ephemeral: false
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

        if (interaction.memberPermissions.has(Permissions.FLAGS.MOVE_MEMBERS) || memberDb.dj) {
            player.destroy()

            embed.setDescription(`**A fila foi limpa por ${interaction.user}**`)
            await interaction.editReply({ content: null, embeds: [embed] })
        } else {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
    }
}
