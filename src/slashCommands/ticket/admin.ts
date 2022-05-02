import slashCommand, { sInteraction } from "../../structures/slashCommand"
import Bot from "../../structures/Client"
import { Permissions, MessageEmbed } from 'discord.js'
import ticket from '../../database/models/ticket'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "admin",
            description: "Recursos administrativos para o bot",
            disabled: false,
            ephemeral: false,
            options: [{
                type: 'SUB_COMMAND',
                name: "ticketdelete",
                description: "Deleta um ticket que esteja aberto",
                options: [{ name: "usuario", description: "O membro que deseja deletar o ticket", type: 6, required: true }]
            }],
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        if (interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const user = interaction.options.getUser('usuario')

            const find = await ticket.findById(interaction.guild.id + user.id)
            if (find) {
                const channel = interaction.guild.channels.cache.get(find.channel.id)
                if (channel) {
                    channel.delete().catch(err => {
                        console.log(err)
                    })

                } else {
                    await ticket.findByIdAndDelete(interaction.guild.id + user.id).then(async () => {
                        embed.setDescription(`**O ticket já foi deletado, ${interaction.user}**`)
                        return await interaction.editReply({ embeds: [embed] })
                    }).catch(async (err) => {
                        console.log(err)
                    })
                }
                await ticket.findByIdAndDelete(interaction.guild.id + user.id).then(async () => {
                    embed.setDescription(`**O ticket de ${user} foi deletado com sucesso**`)
                    return await interaction.editReply({ embeds: [embed] })
                }).catch(async (err) => {
                    console.log(err)
                })

            } else {
                embed.setDescription(`**O usuário ${user} não tem nenhum ticket criado**`)
                return await interaction.editReply({ embeds: [embed] })
            }

        } else {
            embed.setDescription(`**Você não tem permissão para usar esse comando, ${interaction.user.username}**`)
            interaction.editReply({ content: null, embeds: [embed] })
        }
    }
}
