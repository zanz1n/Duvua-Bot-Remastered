import { Event } from '../../structures/Event'
import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "messageCreate"
        })
    }
    run = async (message: sMessage) => {
        if (message.author.bot) return

        const guilDb = await this.client.db.getGuildDbFromMember(message.member)

        await guilDb.save()

        const messageSplited = message.content.trim().split(/ +/g)
        const messageCommand = messageSplited[0].replace(guilDb.prefix, "")
        const args = message.content.replace(guilDb.prefix + messageCommand, "")

        if (message.mentions.users.first() === this.client.user) {
            const cmd = this.client.commands.find((cm: Command) => cm.name === 'help')
            if (!cmd) return
            cmd.run(message, args)
        }
        else if (message.content.startsWith(guilDb.prefix)) {
            const cmd = this.client.commands.find(
                (cm: Command) => cm.aliases.push(cm.name) &&
                    cm.aliases.find((st: string) =>
                        st === messageCommand) === messageCommand);

            if (cmd) {
                cmd.run(message, args).catch((err: Error) => {
                    if (err) console.log("\x1b[31m[bot-err] something whent wrong trying to execute a slashCommand\x1b[0m\n",
                        err,
                        "\n\x1b[33m[bot-api] this may affect the usability of the bot\x1b[0m"
                    )
                })
            }
        } else {
            const memberDb = await this.client.db.getMemberDbFromMember(message.member)

            memberDb.xp++
            let meta = 3 * (memberDb.level ** 2)

            if (memberDb.xp >= meta) {
                const embed = new MessageEmbed()
                while (memberDb.xp >= meta) {
                    meta = 3 * (memberDb.level ** 2)
                    memberDb.level++
                    memberDb.xp -= meta
                }

                if (memberDb.level === 2) {
                    embed.setDescription(`**Parabéns ${message.author}, você avançou para o level ${memberDb.level}**
                    Para conquistar mais níveis, coninue interagindo nesse serivdor.`
                    )
                } else embed.setDescription(`**Parabéns ${message.author}, você avançou para o level ${memberDb.level}**`)
                message.channel.send({ embeds: [embed] })
            }

            await memberDb.save()
        }
        if (guilDb.name !== message.guild.name) {
            guilDb.name = message.guild.name
            await guilDb.save()
        }
    }
}
