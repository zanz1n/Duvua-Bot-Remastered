import slashCommand, { sInteraction } from './slashCommand'
import Bot from './Client'
import {
    MessageActionRow, MessageButton, MessageEmbed, Permissions,

} from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "handleMusicButtons"
        })
    }
    run = async (interaction: sInteraction) => {
        const ver = (name) => interaction.customId === name
        if (!(ver("skip") || ver("stop") || ver("pause") || ver("resume"))) return

        const queue = this.client.player.getQueue(interaction.guildId)
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const pause = new MessageButton().setCustomId('pause').setLabel('⏸️ Pause').setStyle('PRIMARY')
        const resume = new MessageButton().setCustomId('resume').setLabel('▶️ Resume').setStyle('SUCCESS')

        if (interaction.customId === "skip") {
            if (!queue) {
                embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
                return await interaction.reply({ content: null, embeds: [embed], ephemeral: true })
            }
            queue.skip()

            embed.setDescription(`**Música** ${queue.current.title} **pulada por ${interaction.user}**`)
            await interaction.reply({ content: null, embeds: [embed] })

        }
        else if (interaction.customId === "stop") {
            if (!interaction.memberPermissions.has(Permissions.FLAGS.MOVE_MEMBERS)) {
                embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user}**`)
                return await interaction.reply({ content: null, embeds: [embed], ephemeral: true })
            }
            if (!queue) {
                embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
                return await interaction.reply({ content: null, embeds: [embed], ephemeral: true })
            }

            queue.destroy()

            embed.setDescription(`**A fila foi limpa por ${interaction.user}**`)
            await interaction.reply({ content: null, embeds: [embed] })
        }
        else if (interaction.customId === "pause") {
            if (!interaction.memberPermissions.has(Permissions.FLAGS.MOVE_MEMBERS)) {
                embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user}**`)
                return await interaction.reply({ content: null, embeds: [embed], ephemeral: true })
            }
            if (!queue) {
                embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
                return await interaction.reply({ content: null, embeds: [embed], ephemeral: true })
            }

            queue.setPaused(true)

            const button = new MessageActionRow().addComponents(resume)
            embed.setDescription(`**Bot pausado por ${interaction.user}**\nUse /resume para continuar a reprodução`)
            await interaction.reply({ content: null, embeds: [embed], components: [button] })
        }
        else if (interaction.customId === "resume") {

            if (!interaction.memberPermissions.has(Permissions.FLAGS.MOVE_MEMBERS)) {
                embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user}**`)
                return await interaction.reply({ content: null, embeds: [embed], ephemeral: true })
            }
            if (!queue) {
                embed.setDescription(`**Não há nenhum som na fila,  ${interaction.user}**`)
                return await interaction.reply({ content: null, embeds: [embed], ephemeral: true })
            }

            queue.setPaused(false)

            const button = new MessageActionRow().addComponents(pause)
            embed.setDescription(`**Bot despausado por ${interaction.user}**\nUse /pause para pausá-lo`)
            await interaction.reply({ content: null, embeds: [embed], components: [button] })
        }
    }
}
