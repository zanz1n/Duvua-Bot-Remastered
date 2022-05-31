import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    Permissions,
    Message,
    TextChannel
} from 'discord.js'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "clear",
            description: "Limpa uma quantidade mensagens no chat",
            disabled: false,
            aliases: ['cls'],
        })
    }
    run = async (message: sMessage, args: string) => {
        if (message.channel.type === "DM") return;
        if (!message.channel.type.startsWith("GUILD_")) return

        const embed = new MessageEmbed()

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${message.member.user}.**`)
            return await message.reply({ content: null, embeds: [embed] })
        }
        const amount = parseInt(args.replace(" ", "").split(" ")[0])

        if (!amount) {
            embed.setDescription(`**Argumentos inválidos,  ${message.member.user.username}.**` +
                "USO: clear <quantidade>")
            return await message.reply({ content: null, embeds: [embed] })
        }
        if (amount > 99 || amount < 1) {
            embed.setDescription(`**A quantidade precisa ser um número inteiro entre 1 e 99,  ${message.member.user}.**` +
                "USO: clear <quantidade>")
            return await message.reply({ content: null, embeds: [embed] })
        }
        const msgChannel = message.channel as TextChannel
        const messages = (await msgChannel).fetch() as any

        await message.channel.bulkDelete(amount + 1, true).then(async (msgs: any) => {
            embed.setDescription(`**${message.member.user} limpou ${msgs.size - 1} mensagens no canal de texto!**`)
            await message.channel.send({ content: null, embeds: [embed] })
        }).catch(async (err: Error) => {
            embed.setDescription(`**Não foram possível limpar as mesagens, ${message.member.user}**`)
            await message.channel.send({ content: null, embeds: [embed] })
        })
    }
}
