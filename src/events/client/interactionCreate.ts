import Event from '../../structures/Event'
import Bot from '../../structures/Client'
import { sInteraction } from '../../structures/slashCommand'
import slashCommand from "../../structures/slashCommand"
import {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    TextChannel,
    MessageComponentInteraction
} from 'discord.js'
import ticket from '../../database/models/ticket'
import guild from '../../database/models/guild'

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "interactionCreate"
        })
    }
    run = async (interaction: sInteraction) => {
        if (interaction.user.bot) return

        if (interaction.isCommand()) {
            if (this.client.config.dev_mode) console.log(`\x1b[36m[bot-events] Command Interaction created\x1b[0m`)
            const cmd = await this.client.slashCommands.find((c: slashCommand) => c.name === interaction.commandName)

            if (!cmd) return
            if (cmd.disabled) {
                return interaction.reply("Commando Desabilitado")
            }
            if (cmd.ephemeral) {
                await interaction.deferReply({ ephemeral: true })
            } else {
                await interaction.deferReply({ ephemeral: false })
            }

            cmd.run(interaction).catch((err: Error) => {
                if (err) console.log("\x1b[31m[bot-err] something whent wrong trying to execute a slashCommand\x1b[0m\n",
                    err,
                    "\n\x1b[33m[bot-api] this may affect the usability of the bot\x1b[0m"
                )
            })
        }
        if (interaction.isButton()) {
            const guilDb = await guild.findById(interaction.guild.id) ||
                new guild({
                    _id: interaction.guild.id,
                    name: interaction.guild.name
                })
            if (!guilDb.enable_ticket) {
                const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                    .setDescription(`**O uso de tickets não é permitido nesse servidor, ${interaction.user}**`)
                return await interaction.reply({ content: null, embeds: [embed] })
            }
            if (interaction.customId === "permaTicketButton") {
                await interaction.deferReply()

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

                collector.on("collect", async (i: sInteraction) => {
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

                                const ticketChannel = await interaction.guild.channels.cache.get(data.id) as TextChannel

                                interactiondb.channel = {
                                    id: ticketChannel.id,
                                    name: ticketChannel.name
                                }
                                await interactiondb.save()

                                const goToChannel = new MessageButton()
                                    .setLabel('🚀 Ir')
                                    .setURL(`https://discord.com/channels/${i.guild.id}/${interactiondb.channel.id}`)
                                    .setStyle('LINK')
                                const cancelInChannel = new MessageButton()

                                const goToChannelComponent = new MessageActionRow().addComponents(goToChannel)

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
                                const collector = ticketChannel.createMessageComponentCollector({ filter, max: 1, time: 60000 })

                                collector.on("collect", async (tI: sInteraction) => {
                                    if (tI.customId === "cancel") {
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
                                const find = await ticket.findById(interaction.guild.id + interaction.user.id)
                                if (find) {
                                    await ticket.findByIdAndDelete(interaction.guild.id + interaction.user.id).catch(async (err) => {
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
                            return await i.reply({ content: null, embeds: [confEmbed] })
                        }
                    }
                })
            } else if (interaction.customId === "hello") {
                return console.warn("hello")
            }
        }
    }
}
