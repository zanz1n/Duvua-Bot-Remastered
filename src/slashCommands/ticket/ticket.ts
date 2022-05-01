import slashCommand, { sInteraction } from '../../structures/slashCommand'
import {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    TextChannel,
} from 'discord.js'

import Bot from '../../structures/Client'
import ticket from '../../database/models/ticket'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "ticket",
            description: "Comandos para a criação de tickets",
            ephemeral: false,
            disabled: false,
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: "create",
                    description: "Cria um ticket",
                    options: [{ name: "canal", description: "O canal para criar o ticket", type: 7, required: true }]
                },
                {
                    type: 'SUB_COMMAND',
                    name: "delete",
                    description: "Deleta seus tickets, caso você tenha um"
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const subCommand = interaction.options.getSubcommand()

        if (subCommand === "create") {
            const buyEmbed = new MessageEmbed()

            const channel = interaction.options.getChannel('canal')

            if (channel.type !== "GUILD_TEXT") {
                buyEmbed.setDescription(`**Você precisa selecionar um canal de texto válido, ${interaction.user}**`)
                return await interaction.editReply({ content: null, embeds: [buyEmbed] })
            }

            const interactiondb = await ticket.findById(interaction.guild.id + interaction.user.id)

            if (interactiondb) {
                buyEmbed.setDescription(`**Você já tem um ticket criado, ${interaction.user}**`)
                return await interaction.editReply({ embeds: [buyEmbed] })
            }

            buyEmbed.setTitle(`🚀Nitro classic\n💸Preço: 5$\n🛒Estoque: 15`)
                .setColor("#00ff00")
                .setDescription(`Clique no botão \`"🛒 Comprar"\` para comprar`)

            const buy = new MessageButton().setCustomId('buy').setLabel('🛒 Comprar').setStyle('PRIMARY')
            const button = new MessageActionRow().addComponents(buy)

            interaction.editReply({ embeds: [buyEmbed], components: [button] })

            const filter = (btnInt) => {
                return btnInt.user.id === interaction.user.id
            }
            const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 60000 })

            collector.on("collect", async (i: sInteraction) => {
                if (i.isButton) {
                    if (i.customId === "buy") {
                        buy.setDisabled(true)
                        interaction.editReply({ components: [button] })
                        const interactiondb = await ticket.findById(i.guild.id + i.user.id) ||
                            new ticket({
                                _id: i.guild.id + i.user.id,
                                user: {
                                    id: i.user.id,
                                    tag: i.user.tag
                                },
                                opened: false,
                                guildId: i.guild.id
                            })

                        interactiondb.save()
                        const embed = new MessageEmbed()

                        await interaction.guild.channels.create(`Ticket-${interaction.user.tag}`, {
                            permissionOverwrites: [
                                {
                                    id: interaction.user.id,
                                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                                },
                                {
                                    id: interaction.guild.roles.everyone,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: this.client.user.id,
                                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                                },
                            ]
                        }).then(async (data) => {
                            interactiondb.opened = true

                            const ticketChannel = interaction.guild.channels.cache.get(data.id) as TextChannel

                            interactiondb.channel = {
                                id: ticketChannel.id,
                                name: ticketChannel.name
                            }
                            interactiondb.save()

                            const goToChannel = new MessageButton()
                                .setLabel('🚀 Ir')
                                .setURL(`https://discord.com/channels/${i.guild.id}/${interactiondb.channel.id}`)
                                .setStyle('LINK')

                            const goToChannelComponent = new MessageActionRow().addComponents(goToChannel)

                            embed.setDescription(`**O seu ticket foi criado, ${interaction.user}**`)
                            await i.reply({ embeds: [embed], components: [goToChannelComponent], ephemeral: true })

                            const cancel = new MessageButton().setCustomId('cancel').setLabel('❌ Cancelar').setStyle('DANGER')
                            const button = new MessageActionRow().addComponents(cancel)

                            const filter = (btnInt) => {
                                return btnInt.user.id === interaction.user.id
                            }
                            const collector = ticketChannel.createMessageComponentCollector({ filter, max: 1, time: 60000 })

                            collector.on("collect", async (tI: sInteraction) => {
                                if (tI.customId === "cancel") {
                                    const embed = new MessageEmbed()
                                    const find = await ticket.findById(interaction.guild.id + interaction.user.id)
                                    if (find) {
                                        const channel = interaction.guild.channels.cache.get(find.channel.id)
                                        if (channel) {
                                            channel.delete().catch(err => {
                                                console.log(err)
                                            })
                                        }
                                        await ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).then(async () => {
                                            embed.setDescription(`**Seu ticket foi deletado com sucesso, ${interaction.user}**`)
                                            return await i.channel.send({ embeds: [embed] })
                                        }).catch(async (err) => {
                                            console.log(err)
                                        })

                                    } else {
                                        embed.setDescription(`**Você não tem nenhum ticket criado, ${interaction.user}**`)
                                        return await tI.reply({ embeds: [embed] })
                                    }
                                }
                            })
                            const ticketEembd = new MessageEmbed().setDescription("**Seu ticket foi criado nesse canal**\nUse o botão abaixo caso deseje deletar")

                            ticketChannel.send({ content: `${interaction.user}`, embeds: [ticketEembd], components: [button] })

                        }).catch(async err => {
                            console.log(err)
                            const find = await ticket.findById(interaction.guild.id + interaction.user.id)
                            if (find) {
                                await ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).catch(async (err) => {
                                })
                            }
                            embed.setDescription(`**Não foi possível criar o seu ticket,  ${interaction.user}\nSe você já tem um criado, feche ele**`)
                            interaction.editReply({ embeds: [embed] })
                        })
                    }
                }
            })

        }
        else if (subCommand === "delete") {
            const embed = new MessageEmbed()
            const find = await ticket.findById(interaction.guild.id + interaction.user.id)
            if (find) {
                const channel = interaction.guild.channels.cache.get(find.channel.id)
                if (channel) {
                    channel.delete().catch(err => {
                        console.log(err)
                    })
                } else {
                    await ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).then(async () => {
                        embed.setDescription(`**O ticket já foi deletado por um moderador, ${interaction.user}**`)
                        return await interaction.editReply({ embeds: [embed] })
                    }).catch(async (err) => {
                        console.log(err)
                    })
                }
                await ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).then(async () => {
                    embed.setDescription(`**Seu ticket foi deletado com sucesso, ${interaction.user}**`)
                    return await interaction.editReply({ embeds: [embed] })
                }).catch(async (err) => {
                    console.log(err)
                })

            } else {
                embed.setDescription(`**Você não tem nenhum ticket criado, ${interaction.user}**`)
                return await interaction.editReply({ embeds: [embed] })
            }
        }
    }
}
