import slashCommand, { sInteraction } from "../../structures/slashCommand"
import Bot from "../../structures/Client"
import {
    Permissions,
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    TextChannel
} from 'discord.js'
import ticket from '../../database/models/ticket'
import guild from '../../database/models/guild'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "ticketadmin",
            description: "Recursos administrativos para o bot",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: "delete",
                    description: "Deleta um ticket que esteja aberto",
                    options: [
                        {
                            name: "usuario",
                            description: "O membro que deseja deletar o ticket",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: "addpermanent",
                    description: "Adiciona um botão de ticket permanente no canal",
                    options: [
                        {
                            name: "canal",
                            description: "O canal para criar o ticket permanente",
                            type: 7,
                            required: true
                        },
                        {
                            name: "mensagem",
                            description: "A mensagem que será exibida acima do botão de ticket",
                            type: 3,
                            required: false
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: "disable",
                    description: "Desabilita o sistema de tickets no servidor",
                },
                {
                    type: 'SUB_COMMAND',
                    name: "enable",
                    description: "Habilita o sistema de tickets no servidor",
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const subCommand = interaction.options.getSubcommand()
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }

        if (subCommand === "addpermanent") {
            const channel = interaction.options.getChannel("canal")

            if (channel.type !== "GUILD_TEXT") {
                embed.setDescription(`**Por favor insira um canal de texto válido, ${interaction.user}**`)
                return await interaction.editReply({ embeds: [embed] })

            } else {
                let message = interaction.options.getString('mensagem')
                if (!message) {
                    message = "**Clique no botão abaixo para criar um ticket**"
                }
                const channel = interaction.options.getChannel('canal') as TextChannel
                const permaEmbed = new MessageEmbed().setColor(this.client.config.embed_default_color)

                const permaTicketButton = new MessageButton()
                    .setCustomId('permaTicketButton')
                    .setLabel('#️⃣ Criar Ticket')
                    .setStyle('SUCCESS')
                const permaTicket = new MessageActionRow().addComponents(permaTicketButton)

                permaEmbed.setDescription(`${message}`)
                if (interaction.options.getString('mensagem')) {
                    permaEmbed.setFooter({
                        text: `Mensagem por ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: false, format: 'png' })
                    })
                }
                embed.setDescription(`**Ticket permanente criado, ${interaction.user}**`)
                interaction.editReply({ content: null, embeds: [embed] })
                await channel.send({ content: null, embeds: [permaEmbed], components: [permaTicket] })
            }
        }
        else if (subCommand === "delete") {
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
            const guilDb = await guild.findById(interaction.guild.id) ||
                await new guild({
                    _id: interaction.guild.id,
                    name: interaction.guild.name
                })
            if (subCommand === "disable") {
                if (guilDb.enable_ticket === false) {
                    embed.setDescription(`**Os tickets já estavam desabilitados nesse servidor, ${interaction.user}**
                    Nada mudou nesse caso`)
                    return await interaction.editReply({ content: null, embeds: [embed] })
                }
                guilDb.enable_ticket = false

                await guilDb.save().then(async () => {
                    embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user}**
                    Agora os tickets **não** podem mais ser utilizados no servidor`)
                    return await interaction.editReply({ content: null, embeds: [embed] })
                }).catch(async (err: Error) => {
                    console.log(err)
                    embed.setDescription(`**Não foi possível alterar as configurações do bot, ${interaction.user}**\nTente novamente mais tarde`)
                    return await interaction.editReply({ content: null, embeds: [embed] })
                })
            }
            if (subCommand === "enable") {
                if (guilDb.enable_ticket === true) {
                    embed.setDescription(`**Os tickets já estavam habilitados nesse servidor, ${interaction.user}**
                    Nada mudou nesse caso`)
                    return await interaction.editReply({ content: null, embeds: [embed] })
                }
                guilDb.enable_ticket = true

                await guilDb.save().then(async () => {
                    embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user}**
                    Agora os tickets podem ser utilizados no servidor`)
                    return await interaction.editReply({ content: null, embeds: [embed] })
                }).catch(async (err: Error) => {
                    console.log(err)
                    embed.setDescription(`**Não foi possível alterar as configurações do bot, ${interaction.user}**
                    Tente novamente mais tarde`)
                    return await interaction.editReply({ content: null, embeds: [embed] })
                })
            }
        }
    }
}
