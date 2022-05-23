import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    MessageActionRow,
    MessageButton,
    Permissions
} from "discord.js"

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "resume",
            description: "Despausa a reprodução do bot",
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
        if (interaction.memberPermissions.has(Permissions.FLAGS.MOVE_MEMBERS) || memberDb.dj) {
            if (!player.paused) {
                embed.setDescription(`**O player não esta pausado, ${interaction.user}**`)
            } else {
                player.pause(false)
                embed.setDescription(`**Fila despausada por ${interaction.user}**\n` +
                    `Use /pause para pausá-lo`)

                const pause = new MessageButton()
                    .setCustomId('pause')
                    .setEmoji(`⏸️`)
                    .setLabel('Pause')
                    .setStyle('PRIMARY')
                const button = new MessageActionRow().addComponents(pause)
                return interaction.editReply({ content: null, embeds: [embed], components: [button] })
            }

            await interaction.editReply({ content: null, embeds: [embed] })
        } else {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
    }
}
