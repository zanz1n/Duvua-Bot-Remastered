import Event from "../../structures/Event"
import Bot from "../../structures/Client"
import {
    MessageEmbed
} from 'discord.js'
import guild from '../../database/models/guild'
import member from '../../database/models/member'
import Command, { sMessage } from '../../structures/Command'

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "messageCreate"
        })
    }
    run = async (message: sMessage) => {
        if (message.author.bot) return

        const guilDb = await guild.findById(message.guild.id) ||
            await new guild({ _id: message.guild.id, name: message.guild.name });

        await guilDb.save()

        const messageSplited = message.content.trim().split(/ +/g)
        const messageCommand = messageSplited[0].replace(guilDb.prefix, "")
        const args = message.content.replace(guilDb.prefix + messageCommand, "")

        if (message.mentions.users.first() === this.client.user) {
            const cmd = this.client.commands.find((cm: Command) => cm.name === 'help') as Command
            cmd.run(message, args)
        }
        else if (message.content.startsWith(guilDb.prefix)) {
            const cmd = this.client.commands.find(
                (cm: Command) => cm.aliases.push(cm.name) &&
                    cm.aliases.find((st: string) =>
                        st === messageCommand) === messageCommand) as Command;

            if (cmd) {
                cmd.run(message, args)
            }
        } else {
            const memberDb = await member.findById(message.guild.id + message.author.id) ||
                new member({
                    _id: message.guild.id + message.author.id,
                    guildid: message.guild.id,
                    usertag: message.author.tag
                })

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
