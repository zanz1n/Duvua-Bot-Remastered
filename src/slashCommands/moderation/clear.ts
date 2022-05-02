import slashCommand, { sInteraction } from '../../structures/slashCommand'
import Bot from '../../structures/Client'
import { MessageEmbed, Permissions, Message, TextChannel } from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "clear",
            description: "Limpa uma quantidade mensagens no chat",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    name: "quantidade",
                    description: "A quantidade de mensagens que deseja excluir",
                    type: 10,
                    required: false
                },
                {
                    name: "usuario",
                    description: "De quem você deseja excluir as mensagens",
                    type: 6,
                    required: false
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        if (interaction.channel.type === "DM") return;
        const embed = new MessageEmbed()

        if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${interaction.user.username}.**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
        const amount = interaction.options.getNumber("quantidade")
        const target = interaction.options.getMember("usuario")

        if (amount > 99 || amount < 1) {
            embed.setDescription(`**A quantidade precisa ser um número inteiro entre 1 e 100,  ${interaction.user.username}.**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
        interaction.deleteReply()
        const msgChannel = interaction.channel as TextChannel
        const messages = await msgChannel.fetch() as any

        if (target) {
            let i = 0
            const filter = [];
            (await messages).filter((m: Message) => {
                if (m.author.id === target.id && amount > i) {
                    filter.push(m)
                    i++
                }
            })

            await interaction.channel.bulkDelete(filter, true).then(async (msgs: any) => {
                embed.setDescription(`**Foram limpadas \`${msgs.size}\` mensagens de ${target} no canal de texto!**`)
                await interaction.channel.send({ content: null, embeds: [embed] })
            }).catch(async (err: Error) => {
                embed.setDescription(`**Não foram possível limpar as mesagens, ${interaction.user.username}**`)
                await interaction.channel.send({ content: null, embeds: [embed] })
            })
        } else {
            await interaction.channel.bulkDelete(amount, true).then(async (msgs: any) => {
                embed.setDescription(`**Foram limpadas ${msgs.size} mensagens no canal de texto!**`)
                await interaction.channel.send({ content: null, embeds: [embed] })
            }).catch(async (err: Error) => {
                embed.setDescription(`**Não foram possível limpar as mesagens, ${interaction.user.username}**`)
                await interaction.channel.send({ content: null, embeds: [embed] })
            })
        }
    }
}
