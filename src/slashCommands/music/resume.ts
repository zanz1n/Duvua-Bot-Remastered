import slashCommand, { sInteraction } from "../../structures/slashCommand"
import Bot from "../../structures/Client"
import {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Permissions
} from "discord.js"
import Member from '../../database/models/member'

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
        const queue = this.client.player.getQueue(interaction.guildId)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const { user } = interaction
        const memberDb = await Member.findById(interaction.guild.id + user.id) ||
            new Member({
                _id: interaction.guild.id + user.id,
                guildid: interaction.guild.id,
                userid: user.id,
                usertag: user.tag
            })

        if (!queue) {
            embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
        if (interaction.memberPermissions.has(Permissions.FLAGS.MOVE_MEMBERS) || memberDb.dj) {
            queue.setPaused(false)
            const pause = new MessageButton()
                .setCustomId('pause')
                .setEmoji(`⏸️`)
                .setLabel('Pause')
                .setStyle('PRIMARY')
            const button = new MessageActionRow().addComponents(pause)
            embed.setDescription(`**Fila despausado por ${interaction.user}**\nUse /pause para pausá-lo`)
            await interaction.editReply({ content: null, embeds: [embed], components: [button] })
        } else {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
    }
}
