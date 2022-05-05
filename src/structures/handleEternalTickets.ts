import slashCommand, { sInteraction } from './slashCommand'
import Bot from './Client'
import {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    TextChannel,
    MessageComponentInteraction
} from 'discord.js'
import ticket from '../database/models/ticket'
import guild from '../database/models/guild'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "eternalTicket",
        })
    }
    run = async (interaction: sInteraction) => {
        const sleep = (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)) }

        const guilDb = await guild.findById(interaction.guild.id) ||
            new guild({
                _id: interaction.guild.id,
                name: interaction.guild.name
            })
        if (!guilDb.enable_ticket) {
            const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                .setDescription(`**O uso de tickets não é permitido nesse servidor, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }

        const dateNow = new Date
        const confEmbed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const interactiondb = await ticket.findById(interaction.guild.id + interaction.user.id)

        if (interactiondb) {
            confEmbed.setDescription(`**Você já tem um ticket criado, ${interaction.user}**`)
            return await interaction.editReply({ embeds: [confEmbed] })
        }

        confEmbed.setDescription(`**Você deseja realmente abrir o ticket, ${interaction.user}**`)

        const ticketYes = new MessageButton()
            .setCustomId(`ticketYes${dateNow}`)
            .setLabel('✅ Sim')
            .setStyle('SUCCESS')
        const ticketNo = new MessageButton()
            .setCustomId(`ticketNo${dateNow}`)
            .setLabel('❌ Não')
            .setStyle('DANGER')
        const button = new MessageActionRow().addComponents(ticketYes, ticketNo)

        await interaction.editReply({ embeds: [confEmbed], components: [button] })

        const filter = (btnInt: MessageComponentInteraction) => {
            return btnInt.user.id === interaction.user.id
        }
        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 60000 })

        collector.on("collect", async (i) => {
            if (i.isButton) {
                if (i.customId === `ticketYes${dateNow}`) {
                    ticketYes.setDisabled(true)
                    ticketNo.setDisabled(true)
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
                            .setLabel('🚀 Ir')
                            .setURL(`https://discord.com/channels/${i.guild.id}/${interactiondb.channel.id}`)
                            .setStyle('LINK')
                        const cancelBefore = new MessageButton()
                            .setCustomId(`cancelBefore${dateNow}`)
                            .setLabel('❌ Cancelar')
                            .setStyle('DANGER')

                        const goToChannelComponent = new MessageActionRow().addComponents(goToChannel, cancelBefore)

                        const beforeFilter = (btnInt: MessageComponentInteraction) => {
                            return btnInt.user.id === interaction.user.id
                        }
                        const beforeCollector = i.channel.createMessageComponentCollector({ filter: beforeFilter, max: 1, time: 20000 })

                        beforeCollector.on("collect", async (iO) => {
                            if (iO.customId === `cancelBefore${dateNow}`) {
                                const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
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
                            .setLabel('❌ Cancelar')
                            .setStyle('DANGER')
                        const button = new MessageActionRow().addComponents(cancel)

                        const filter = (btnInt: MessageComponentInteraction) => {
                            return btnInt.user.id === interaction.user.id
                        }
                        const collector = ticketChannel.createMessageComponentCollector({ filter, max: 1, time: 20000 })

                        collector.on("collect", async (tI) => {
                            if (tI.customId === "cancel") {
                                const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                                const find = await ticket.findById(interaction.guild.id + interaction.user.id)
                                if (find) {
                                    const channel = interaction.guild.channels.cache.get(find.channel.id)
                                    if (channel) {
                                        embed.setDescription(`**Seu ticket foi deletado com sucesso, ${interaction.user}**`)
                                        await ticketChannel.send({ embeds: [embed] })
                                        await sleep(2000)
                                        channel.delete().catch(err => {
                                            console.log(err)
                                        })
                                        return
                                    }
                                    await ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).catch(async (err) => {
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
                        const find = await ticket.findById(interaction.guild.id + interaction.user.id)
                        if (find) {
                            await ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).catch(async (err) => {
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
                    return await i.reply({ content: null, embeds: [confEmbed], ephemeral: true })
                }
            }
        })
    }
}
