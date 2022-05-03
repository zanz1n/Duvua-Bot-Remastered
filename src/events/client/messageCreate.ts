import Event from "../../structures/Event"
import Bot from "../../structures/Client"
import { Message, MessageEmbed } from 'discord.js'
import guild from '../../database/models/guild'
import member from '../../database/models/member'

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "messageCreate"
        })
    }
    run = async (message: Message) => {
        if (message.author.bot) return
        if (this.client.config.dev_mode) console.log(`\x1b[36m[bot-events] Message created\x1b[0m`)

        const guilDb = await guild.findById(message.guild.id) ||
            new guild({ _id: message.guild.id, name: message.guild.name })

        await guilDb.save()
        if (message.content.startsWith(guilDb.prefix)) {

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
