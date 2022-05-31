import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    Permissions,
    Message,
    TextChannel
} from 'discord.js'
const sleep = (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)) }

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "count",
            description: "Conta até uma determinada quantidade",
            disabled: false,
            aliases: ['cnt'],
        })
    }
    run = async (message: sMessage, args: string) => {
        if (message.channel.type === "DM") return;
        if (!message.channel.type.startsWith("GUILD_")) return

        const embed = new MessageEmbed()

        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando,  ${message.member.user}.**`)
            return await message.reply({ content: null, embeds: [embed] })
        }
        const amount = parseInt(args.replace(" ", "").split(" ")[0])

        if (!amount) {
            embed.setDescription(`**Argumentos inválidos,  ${message.member.user.username}.**` +
                "USO: count <quantidade>")
            return await message.reply({ content: null, embeds: [embed] })
        }
        if (amount > 10 || amount < 1) {
            embed.setDescription(`**A quantidade precisa ser um número inteiro entre 1 e 9,  ${message.member.user}.**` +
                "USO: count <quantidade>")
            return await message.reply({ content: null, embeds: [embed] })
        }
        const msgChannel = message.channel as TextChannel

        for (let n1 = 1; n1 <= amount; n1++) {
            msgChannel.send({
                content: `${n1}`
            }).catch((err: Error) => {
                console.log(err.name)
            })
            await sleep(1500)
        }
    }
}
