import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed } from '../../types/Embed'
import {
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction
} from 'discord.js'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "slap",
            description: "De espontaneamente um tapa em uma pessoa e com estilo",
            disabled: false,
            aliases: ['sl']
        })
    }
    run = async (message: sMessage) => {
        const user = message.mentions.users.first()

        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const gifLinks = require('../../utils/gifs').gifs_b

        const embed = new Embed()

        if (!user) {
            embed.setDescription(`**Insira um usuário válido, ${message.member.user}**`)
            return message.reply({ content: null, embeds: [embed] })
        }

        else if (user.id === this.client.user.id) {
            embed.setTitle(`Desvio e te mato!`)
                .setDescription(`**Você tenta me acertar, eu desvio e te mato, ${message.member.user}**`)

            return message.reply({ content: null, embeds: [embed] })
        }

        else if (user.id === message.member.user.id) {
            embed.setTitle("Treta! 🔥 🔥 🔥")
                .setDescription(`${message.member.user} estapeou ${user}`)
                .setImage(gifLinks[random(0, gifLinks.length)])
                .setFooter({
                    text: `Requisitado por ${message.member.user.username}`,
                    iconURL: message.member.user.displayAvatarURL({
                        format: 'png',
                        dynamic: false
                    })
                })

            return message.reply({ content: null, embeds: [embed] })
        }

        const dateNow = new Date

        embed.setTitle("Treta! 🔥 🔥 🔥")
            .setDescription(`${message.member.user} estapeou ${user}`)
            .setImage(gifLinks[random(0, gifLinks.length)])
            .setFooter({
                text: `Requisitado por ${message.member.user.username}`,
                iconURL: message.member.user.displayAvatarURL({
                    format: 'png',
                    dynamic: false
                })
            })

        const repeat = new MessageButton()
            .setCustomId(`repeat${dateNow}`)
            .setLabel("Retribuir")
            .setEmoji("🔁")
            .setStyle('PRIMARY')
            .setDisabled(false)

        const component = new MessageActionRow().addComponents(repeat)

        const filter = (btnInt: MessageComponentInteraction) => {
            return btnInt.user.id === user.id
        }

        const collector = message.channel
            .createMessageComponentCollector({ filter, max: 1, time: 90000 })

        collector.on("collect", async (i) => {
            if (i.customId === `repeat${dateNow}`) {
                repeat.setDisabled(true)

                message.reply({ components: [component] })

                const embed = new Embed().setTitle(`A situação está fora de controle!  🔥`)
                    .setDescription(`${i.user} retribuiu o tapa de ${message.member.user}`)
                    .setImage(gifLinks[random(0, gifLinks.length)])

                i.reply({ content: null, embeds: [embed] })
            }
        })

        message.reply({ content: null, embeds: [embed], components: [component] })
    }
}
