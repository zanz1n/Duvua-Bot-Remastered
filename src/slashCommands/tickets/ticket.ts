import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    MessageActionRow,
    MessageButton,
    TextChannel,
    MessageComponentInteraction
} from 'discord.js'
const sleep = (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)) }

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
                    options: [
                        {
                            name: "canal",
                            description: "O canal para criar o ticket",
                            type: 7,
                            required: true
                        }
                    ]
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
        const guilDb = await this.client.db.getGuildDbFromMember(interaction.member)

        await guilDb.save()

        await guilDb.save()
        if (!guilDb.enable_ticket) {
            const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                .setDescription(`**O uso de tickets não é permitido nesse servidor, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }
        const dateNow = new Date
        const subCommand = interaction.options.getSubcommand()

        if (subCommand === "create") {
            const confEmbed = new MessageEmbed().setColor(this.client.config.embed_default_color)

            const channel = await interaction.options.getChannel('canal')

            if (channel.type !== "GUILD_TEXT") {
                confEmbed.setDescription(`**Você precisa selecionar um canal de texto válido, ${interaction.user}**`)
                return interaction.editReply({ content: null, embeds: [confEmbed] })
            }

            const interactiondb = await this.client.db.findTicketDbFromMember(interaction.member)

            if (interactiondb) {
                confEmbed.setDescription(`**Você já tem um ticket criado, ${interaction.user}**`)
                return interaction.editReply({ embeds: [confEmbed] })
            }

            confEmbed.setDescription(`**Você deseja realmente abrir o ticket, ${interaction.user}**`)

            const ticketYes = new MessageButton()
                .setCustomId(`ticketYes${dateNow}`)
                .setEmoji(`✅`)
                .setLabel('Sim')
                .setStyle('SUCCESS')
            const ticketNo = new MessageButton()
                .setCustomId(`ticketNo${dateNow}`)
                .setEmoji(`❌`)
                .setLabel('Não')
                .setStyle('DANGER')
            const button = new MessageActionRow().addComponents(ticketYes, ticketNo)

            await interaction.editReply({ embeds: [confEmbed], components: [button] })

            const filter = (btnInt: MessageComponentInteraction) => {
                return btnInt.user.id === interaction.user.id
            }
            const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 20000 })

            collector.on("collect", async (i: sInteraction) => {
                if (i.isButton) {
                    if (i.customId === `ticketYes${dateNow}`) {
                        ticketYes.setDisabled(true)
                        ticketNo.setDisabled(true)
                        interaction.editReply({ components: [button] })
                        const interactiondb = await this.client.db.getTicketDbFromMember(i.member)

                        await interactiondb.save().catch((err: Error) => {
                            console.log("ERRO NA DATABASE", err.name)
                        })
                        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

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
                            await interactiondb.save()

                            const goToChannel = new MessageButton()
                                .setEmoji(`🚀`)
                                .setLabel('Ir')
                                .setURL(`https://discord.com/channels/${i.guild.id}/${interactiondb.channel.id}`)
                                .setStyle('LINK')
                            const cancelBefore = new MessageButton()
                                .setCustomId(`cancelBefore${dateNow}`)
                                .setEmoji(`❌`)
                                .setLabel('Cancelar')
                                .setStyle('DANGER')

                            const goToChannelComponent = new MessageActionRow().addComponents(goToChannel, cancelBefore)

                            const beforeFilter = (btnInt: MessageComponentInteraction) => {
                                return btnInt.user.id === interaction.user.id
                            }
                            const beforeCollector = i.channel.createMessageComponentCollector({ filter: beforeFilter, max: 1, time: 20000 })

                            beforeCollector.on("collect", async (iO) => {
                                if (iO.customId === `cancelBefore${dateNow}`) {
                                    const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                                    const find = await this.client.db.findTicketDbFromMember(interaction.member)
                                    if (find) {
                                        const channel = interaction.guild.channels.cache.get(find.channel.id)
                                        if (channel) {
                                            channel.delete().catch(err => {
                                                console.log(err)
                                            })
                                        }
                                        await this.client.db.models.Ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id)
                                            .then(async () => {
                                                embed.setDescription(`**Seu ticket foi deletado com sucesso, ${interaction.user}**`)
                                                return await iO.reply({ embeds: [embed], ephemeral: true })
                                            }).catch(async (err) => {
                                                console.log(err)
                                            })

                                    } else {
                                        embed.setDescription(`**Você não tem nenhum ticket criado, ${interaction.user}**`)
                                        return await iO.reply({ embeds: [embed] })
                                    }
                                }
                            })
                            embed.setDescription(`**O seu ticket foi criado, ${interaction.user}**`)
                            await i.reply({ embeds: [embed], components: [goToChannelComponent], ephemeral: true })

                            const cancel = new MessageButton()
                                .setCustomId('cancel')
                                .setEmoji(`❌`)
                                .setLabel('Cancelar')
                                .setStyle('DANGER')
                            const button = new MessageActionRow().addComponents(cancel)

                            const filter = (btnInt: MessageComponentInteraction) => {
                                return btnInt.user.id === interaction.user.id
                            }
                            const collector = ticketChannel.createMessageComponentCollector({ filter, max: 1, time: 20000 })

                            collector.on("collect", async (tI) => {
                                if (tI.customId === "cancel") {
                                    const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                                    const find = await this.client.db.findTicketDbFromMember(interaction.member)
                                    if (find) {
                                        const channel = interaction.guild.channels.cache.get(find.channel.id)
                                        if (channel) {
                                            channel.delete().catch(err => {
                                                console.log(err)
                                            })
                                        }
                                        await this.client.db.models.Ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).then(async () => {
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
                            const ticketEembd = new MessageEmbed()
                                .setDescription("**Seu ticket foi criado nesse canal**\nUse o botão abaixo caso deseje deletar")
                                .setColor(this.client.config.embed_default_color)

                            ticketChannel.send({ content: `${interaction.user}`, embeds: [ticketEembd], components: [button] })

                        }).catch(async err => {
                            console.log(err)
                            const find = await this.client.db.findTicketDbFromMember(interaction.member)
                            if (find) {
                                await this.client.db.models.Ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).catch(async (err) => {
                                    console.log(err)
                                })
                            }
                            embed.setDescription(`**Não foi possível criar o seu ticket,  ${interaction.user}\nSe você já tem um criado, feche ele**`)
                            interaction.editReply({ embeds: [embed] })
                        })
                    } else if (i.customId === `ticketNo${dateNow}`) {
                        ticketYes.setDisabled(true)
                        ticketNo.setDisabled(true)
                        interaction.editReply({ components: [button] })
                        confEmbed.setDescription(`**Seu ticket foi cancelado, ${interaction.user}**`)
                        return i.reply({ content: null, embeds: [confEmbed] })
                    }
                }
            })
        }
        else if (subCommand === "delete") {
            const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
            const find = await this.client.db.findTicketDbFromMember(interaction.member)
            if (find) {
                const channel = interaction.guild.channels.cache.get(find.channel.id)
                if (channel) {
                    await this.client.db.models.Ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).then(async () => {
                        embed.setDescription(`**Seu ticket foi deletado com sucesso, ${interaction.user}**`)
                        return interaction.editReply({ embeds: [embed] })
                    }).catch(async (err: Error) => {
                        console.log(err)
                    })
                    await sleep(1250)
                    await channel.delete().catch((err: Error) => {
                        console.log(err)
                    })
                } else {
                    await this.client.db.models.Ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).then(async () => {
                        embed.setDescription(`**O ticket já foi deletado por um moderador, ${interaction.user}**`)
                        return interaction.editReply({ embeds: [embed] })
                    }).catch(async (err: Error) => {
                        console.log(err)
                    })
                }

            } else {
                embed.setDescription(`**Você não tem nenhum ticket criado, ${interaction.user}**`)
                return interaction.editReply({ embeds: [embed] })
            }
        }
    }
}
