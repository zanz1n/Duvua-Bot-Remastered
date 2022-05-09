import Command, { sMessage } from '../../structures/Command'
import Bot from '../../structures/Client'
import {
    SelectMenuInteraction,
    MessageComponentInteraction
} from 'discord.js'
import Guild from '../../database/models/guild'
import replies from '../../utils/help'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "help",
            description: "Exibe as funções e os comandos do bot",
            disabled: false,
            aliases: ['ajuda', 'h'],
        })
    }
    run = async (message: sMessage) => {
        const { guild, author, channel } = message

        const dateNow = new Date
        const guilDb = await Guild.findById(guild.id) ||
            new Guild({ _id: guild.id, name: guild.name })

        const filter = (btnInt: MessageComponentInteraction) => btnInt.isSelectMenu() && btnInt.user.id === author.id

        const collector = channel.createMessageComponentCollector({ filter, time: 180000 })

        const msg = await message.reply({
            content: null,
            embeds: [replies.index(this.client, message.author, guilDb)],
            components: [replies.row(dateNow)]
        }) as sMessage

        collector.on("collect", async (i: SelectMenuInteraction) => {
            const values = i.values[0]
            if (values === `fun${dateNow}`) {
                i.deferUpdate()
                msg.edit({ content: null, embeds: [replies.fun(this.client, message.author, guilDb)] })
            }
            else if (values === `info${dateNow}`) {
                i.deferUpdate()
                msg.edit({ content: null, embeds: [replies.info(this.client, message.author, guilDb)] })
            }
            else if (values === `mod-util${dateNow}`) {
                i.deferUpdate()
                msg.edit({ content: null, embeds: [replies.modUtil(this.client, message.author, guilDb)] })
            }
            else if (values === `music${dateNow}`) {
                i.deferUpdate()
                msg.edit({ content: null, embeds: [replies.music(this.client, message.author, guilDb)] })
            }
            else if (values === `money${dateNow}`) {
                i.deferUpdate()
                msg.edit({ content: null, embeds: [replies.money(this.client, message.author, guilDb)] })
            }
        })
    }
}
