import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    GuildMember,
    MessageActionRow,
    MessageButton,
    Permissions
} from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "ban",
            description: "Bane um usuário",
            ephemeral: false,
            disabled: false,
            options: [
                {
                    name: "usuario",
                    description: "Usuário que deseja banir",
                    type: 6,
                    required: true
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        if (!interaction.memberPermissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user}**`)
            return await interaction.editReply({ embeds: [embed] })
        }

        const member = interaction.options.getMember('usuario')

        if ((!(member instanceof GuildMember) || member.partial)) return

        if (member === interaction.member) {
            embed.setDescription(`**Você não pode banir a si mesmo, ${interaction.user}**`)
            return await interaction.editReply({ embeds: [embed] })
        }

        const yes = new MessageButton()
            .setCustomId('yes')
            .setEmoji(`🔨`)
            .setLabel('Banir')
            .setStyle('DANGER')
        const no = new MessageButton()
            .setCustomId('no')
            .setEmoji(`❌`)
            .setLabel('Cancelar')
            .setStyle('PRIMARY')

        const button = new MessageActionRow().addComponents(yes, no)

        embed.setDescription(`**Você tem certeza que deseja banir ${member}?**`)

        const filter = (i) => i.isButton() && i.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 20000 })

        await interaction.editReply({ content: null, embeds: [embed], components: [button] })

        collector.on("collect", async (i) => {
            const collectorEmbed = new MessageEmbed().setColor(this.client.config.embed_default_color)
            if (i.customId === "yes") {
                yes.setDisabled(true)
                no.setDisabled(true)

                await interaction.editReply({ components: [button] })

                collectorEmbed.setDescription(`**${member} foi banido com sucesso por ${i.user}**`)
                    member.ban().then(() => {
                        i.reply({ content: null, embeds: [collectorEmbed] })
                    }).catch(err => {
                        collectorEmbed.setDescription(`**Eu não tenho permissões para banir ${member}**`)
                        i.reply({ content: null, embeds: [collectorEmbed] })
                    })
            }
            else if (i.customId === "no") {
                yes.setDisabled(true)
                no.setDisabled(true)

                await interaction.editReply({ components: [button] })

                collectorEmbed.setDescription(`**Operação abortada com sucesso por ${i.user}**`)

                i.reply({ content: null, embeds: [collectorEmbed] })
            }
        })
    }
}
