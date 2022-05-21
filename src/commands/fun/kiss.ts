import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction
} from 'discord.js'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "kiss",
            description: "Beija alguém",
            disabled: false,
            aliases: ['ks']
        })
    }
    run = async (message: sMessage) => {
        const user = message.mentions.users.first()

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const links = require('../../utils/gifs').gifs_a

        if (!user) {
            embed.setDescription(`**Marque um usuário válido na mensagem, ${message.author}**`)
            return await message.reply({ embeds: [embed] })
        }
        if (user.id === this.client.user.id) {
            embed.setDescription(`**Vamos manter nossa relação como uma amizade, ok ${message.author}?**`)
            return await message.reply({ embeds: [embed] })
        }
        else if (user.bot) {
            embed.setDescription(`**Você não pode beijar um bot ${message.author}!**`)
            return await message.reply({ embeds: [embed] })
        }
        else if (user === message.author) {
            embed.setTitle(`O amor está no ar!  \:heart:`).setDescription(`${message.author} beijou ${user}`)
                .setImage(links[random(0, links.length)])
            return await message.reply({ embeds: [embed] })
        }
        else {
            const dateNow = new Date
            embed.setTitle(`O amor está no ar!  \:heart:`).setDescription(`${message.author} beijou ${user}`).setImage(links[random(0, links.length)])
                .setFooter({ text: `Requisitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() }).setTimestamp()

            const repeat = new MessageButton()
                .setCustomId(`repeat${dateNow}`)
                .setEmoji(`🔁`)
                .setLabel('Retribuir')
                .setStyle('PRIMARY')

            const reject = new MessageButton()
                .setCustomId(`reject${dateNow}`)
                .setEmoji(`❌`)
                .setLabel('Recusar')
                .setStyle('PRIMARY')

            const button = new MessageActionRow().addComponents(repeat, reject)
            const msg = await message.reply({ embeds: [embed], components: [button] })

            const filter = (btnInt: MessageComponentInteraction) => {
                return btnInt.user.id === user.id
            }
            const collector = message.channel.createMessageComponentCollector({ filter, max: 1, time: 90000 })

            collector.on("collect", async (i) => {
                if (i.customId === `repeat${dateNow}`) {
                    repeat.setDisabled(true)
                    reject.setDisabled(true)
                    msg.edit({ components: [button] })

                    const embedRetribuir = new MessageEmbed().setTitle(`As coisas estão pegando fogo aqui!  \:fire:`)
                        .setDescription(`${i.user} retribuiu o beijo de ${message.author}\nSerá que temos um novo casal aqui?  \:heart:`)
                        .setImage(links[random(0, links.length)])

                    await i.reply({ embeds: [embedRetribuir] })
                }
                else if (i.customId === `reject${dateNow}`) {
                    repeat.setDisabled(true)
                    reject.setDisabled(true)
                    msg.edit({ components: [button] })

                    const slap = require('../../utils/gifs').gifs_b
                    const embedRetribuir = new MessageEmbed().setTitle(`Quem nunca levou um fora, né ${message.author.username}`)
                        .setDescription(`${i.user} negou o beijo de ${message.author}  \:broken_heart:`)
                        .setImage(slap[random(0, slap.length)])

                    await i.reply({ embeds: [embedRetribuir] })
                }
            })
        }
    }
}
