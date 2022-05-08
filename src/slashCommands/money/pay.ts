import slashCommand, { sInteraction } from '../../structures/slashCommand'
import Bot from '../../structures/Client'
import {
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    MessageComponentInteraction
} from 'discord.js'
import User from '../../database/models/user'
import Member from '../../database/models/member'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "pay",
            description: "Paga uma quantidade de dinheiro a um usuário",
            options: [{
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
                        type: 3,
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
                        type: 3,
                        required: true
                    }
                ]
            }]
        })
    }
    run = async (interaction: sInteraction) => {
        const dateNow = Date.now
        const subCommand = await interaction.options.getSubcommand()

        if (!(subCommand === 'ouro' || subCommand === 'pratas')) return

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const user = interaction.options.getUser('usuario')
        if (user.id === this.client.user.id) {
            embed.setDescription(`**Na próxima eu roubo seu rico dinheirinho, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
        else if (user.bot) {
            embed.setDescription(`**O usuario ${user} é um bot, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        } else if (user.id === interaction.user.id) {
            embed.setDescription(`**Julgamos a sua tentativa de auto pagamento sus, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }

        const amount = Number(interaction.options.getString('quantidade'))
        if (!amount) {
            embed.setDescription(`**Você precisa inserir um valor valido, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
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
            var member1Db = await Member.findById(interaction.guild.id + interaction.user.id) ||
                new Member({
                    _id: interaction.guild.id + interaction.user.id,
                    guildid: interaction.guild.id,
                    userid: interaction.user.id,
                    usertag: interaction.user.tag
                });
            if (member1Db.silver_coins < amount) {
                embed.setDescription(`**Você não tem ${amount} moedas de prata disponíveis, ${interaction.user}**
                🕳️ Você possui atualmente ${member1Db.silver_coins} moedas de prata`)
                return await interaction.editReply({ content: null, embeds: [embed] })

            } else {
                var member2Db = await Member.findById(interaction.guild.id + user.id) ||
                    new Member({
                        _id: interaction.guild.id + user.id,
                        guildid: interaction.guild.id,
                        userid: user.id,
                        usertag: user.tag
                    });

                embed.setDescription(`**Você deseja transferir ${amount} 🕳️ moedas de prata para ${user}?**
                Você possui atualmente ${member1Db.silver_coins} 🕳️ moedas de prata`)
                await interaction.editReply({ content: null, embeds: [embed], components: [transferComp] })
            }
        }

        if (subCommand === "ouro") {
            var user1Db = await User.findById(interaction.user.id) ||
                new User({ _id: interaction.user.id, usertag: interaction.user.tag });

            if (user1Db.gold_coins < amount) {
                embed.setDescription(`**Você não tem ${amount} moedas de ouro disponíveis, ${interaction.user}**
                🪙 Você possui atualmente ${user1Db.gold_coins} moedas de ouro`)
                return await interaction.editReply({ content: null, embeds: [embed] })
            } else {
                var user2Db = await User.findById(user.id) ||
                    new User({ _id: user.id, usertag: user.tag });

                embed.setDescription(`**Você deseja transferir ${amount} 🪙 moedas de ouro para ${user}?**
                Você possui atualmente ${user1Db.gold_coins} 🪙 moedas de ouro`)
                await interaction.editReply({ content: null, embeds: [embed], components: [transferComp] })
            }
        }
        collector.on("collect", async (i: sInteraction) => {
            const iembed = new MessageEmbed().setColor(this.client.config.embed_default_color)
            if (i.customId === `confirmTransfer${dateNow}`) {
                confirmTransfer.setDisabled(true)
                denyTransfer.setDisabled(true)
                interaction.editReply({ components: [transferComp] }) //intentionally not awaited

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
            }
            else if (i.customId === `denyTransfer${dateNow}`) {
                confirmTransfer.setDisabled(true)
                denyTransfer.setDisabled(true)
                interaction.editReply({ components: [transferComp] }) //intentionally not awaited

                iembed.setDescription(`**Você cancelou o pagamento, ${i.user}**`)
                await i.reply({ embeds: [iembed] })
            }
        })
    }
}
