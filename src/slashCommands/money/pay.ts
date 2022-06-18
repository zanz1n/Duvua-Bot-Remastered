import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    MessageButton,
    MessageActionRow,
    MessageComponentInteraction, GuildMember
} from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "pay",
            description: "Paga uma quantidade de dinheiro a um usuário",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'pratas',
                    description: "Paga uma quantidade de moedas de prata para um alguém",
                    options: [
                        {
                            name: "usuario",
                            description: "Para quem você deseja pagar",
                            type: 6,
                            required: true
                        },
                        {
                            name: "quantidade",
                            description: "Quantidade de moedas que irá pagar",
                            type: 'INTEGER',
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'ouro',
                    description: "Paga uma quantidade de moedas de ouro para um alguém",
                    options: [
                        {
                            name: "usuario",
                            description: "Para quem você deseja pagar",
                            type: 6,
                            required: true
                        },
                        {
                            name: "quantidade",
                            description: "Quantidade de moedas que irá pagar",
                            type: 'INTEGER',
                            required: true
                        }
                    ]
                }
            ]
        })
    }

    run = async (interaction: sInteraction) => {
        const dateNow = Date.now
        const subCommand = await interaction.options.getSubcommand()

        if (!(subCommand === 'ouro' || subCommand === 'pratas')) return

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const member = interaction.options.getMember('usuario')
        if ((!(member instanceof GuildMember) || member.partial)) return

        const { user } = member

        if (user.id === this.client.user.id) {
            embed.setDescription(`**Na próxima eu roubo seu rico dinheirinho, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        } else if (user.bot) {
            embed.setDescription(`**O usuario ${user} é um bot, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        } else if (user.id === interaction.user.id) {
            embed.setDescription(`**Julgamos a sua tentativa de auto pagamento sus, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }

        const amount = Number(interaction.options.getString('quantidade'))
        if (!amount) {
            embed.setDescription(`**Você precisa inserir um valor valido, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }

        const confirmTransfer = new MessageButton()
            .setCustomId(`confirmTransfer${dateNow}`)
            .setEmoji(`✅`)
            .setLabel('Sim')
            .setStyle('SUCCESS')

        const denyTransfer = new MessageButton()
            .setCustomId(`denyTransfer${dateNow}`)
            .setEmoji(`❌`)
            .setLabel('Não')
            .setStyle('DANGER')

        const transferComp = new MessageActionRow().addComponents(confirmTransfer, denyTransfer)

        const filter = (btnInt: MessageComponentInteraction) => {
            return btnInt.user.id === interaction.user.id
        }

        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 20000 })

        if (subCommand === "pratas") {
            var member1Db = await this.client.db.getMemberDbFromMember(interaction.member)

            if (member1Db.silver_coins < amount) {
                embed.setDescription(`**Você não tem ${amount} moedas de prata disponíveis, ${interaction.user}**
                🕳️ Você possui atualmente ${member1Db.silver_coins} moedas de prata`)
                return await interaction.editReply({ content: null, embeds: [embed] })

            } else {
                var member2Db = await this.client.db.getMemberDbFromMember(member)

                embed.setDescription(`**Você deseja transferir ${amount} 🕳️ moedas de prata para ${user}?**
                Você possui atualmente ${member1Db.silver_coins} 🕳️ moedas de prata`)
                await interaction.editReply({ content: null, embeds: [embed], components: [transferComp] })
            }
        }

        if (subCommand === "ouro") {
            var user1Db = await this.client.db.getUserDbFromMember(interaction.member)

            if (user1Db.gold_coins < amount) {
                embed.setDescription(`**Você não tem ${amount} moedas de ouro disponíveis, ${interaction.user}**
                🪙 Você possui atualmente ${user1Db.gold_coins} moedas de ouro`)
                return await interaction.editReply({ content: null, embeds: [embed] })
            } else {
                var user2Db = await this.client.db.getUserDbFromMember(member)

                embed.setDescription(`**Você deseja transferir ${amount} 🪙 moedas de ouro para ${user}?**
                Você possui atualmente ${user1Db.gold_coins} 🪙 moedas de ouro`)
                await interaction.editReply({ content: null, embeds: [embed], components: [transferComp] })
            }
        }
        collector.on("collect", async (i) => {
            const iembed = new MessageEmbed().setColor(this.client.config.embed_default_color)
            if (i.customId === `confirmTransfer${dateNow}`) {
                confirmTransfer.setDisabled(true)
                denyTransfer.setDisabled(true)
                interaction.editReply({ components: [transferComp] })

                if (subCommand === 'ouro') {
                    user1Db.gold_coins -= amount
                    await user1Db.save()

                    user2Db.gold_coins += amount
                    await user2Db.save()

                    iembed.addField("🪙 Saldos", `${interaction.user.username} = ${user1Db.gold_coins}\n${user.username} = ${user2Db.gold_coins}`)
                } else if (subCommand === 'pratas') {
                    member1Db.silver_coins -= amount
                    await member1Db.save()

                    member2Db.silver_coins += amount
                    await member2Db.save()

                    iembed.addField("🕳️ Saldos", `${interaction.user.username} = ${member1Db.silver_coins}\n${user.username} = ${member2Db.silver_coins}`)
                }
                iembed.setDescription(`**Pagamento realizado com sucesso, ${i.user}**`)

                await i.reply({ embeds: [iembed] })
            } else if (i.customId === `denyTransfer${dateNow}`) {
                confirmTransfer.setDisabled(true)
                denyTransfer.setDisabled(true)
                interaction.editReply({ components: [transferComp] })

                iembed.setDescription(`**Você cancelou o pagamento, ${i.user}**`)
                await i.reply({ embeds: [iembed] })
            }
        })
    }
}
