import Command, { sMessage } from '../../structures/Command'
import Bot from '../../structures/Client'
import {
    MessageActionRow,
    MessageButton,
    MessageEmbed
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
        const user = message.mentions.users.first() || message.author

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const links = require('../../utils/gifs').gifs_a

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
            embed.setTitle(`O amor está no ar!  \:heart:`).setDescription(`${message.author} beijou ${user}`).setImage(links[random(0, links.length)])
                .setFooter({ text: `Requisitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() }).setTimestamp()

            const button = new MessageActionRow().addComponents(
                new MessageButton().setCustomId('1').setLabel('🔁 Retribuir').setStyle('PRIMARY').setDisabled(false),
                new MessageButton().setCustomId('2').setLabel('❌ Recusar').setStyle('PRIMARY').setDisabled(false)
            )
            await message.reply({ embeds: [embed], components: [button] })

            const filter = (btnInt) => {
                return btnInt.user.id === user.id
            }
            const collector = message.channel.createMessageComponentCollector({ filter, max: 1, time: 90000 })

            collector.on("collect", async (i) => {
                if (i.customId === '1') {
                    const embedRetribuir = new MessageEmbed().setTitle(`As coisas estão pegando fogo aqui!  \:fire:`)
                        .setDescription(`${i.user} retribuiu o beijo de ${message.author}\nSerá que temos um novo casal aqui?  \:heart:`)
                        .setImage(links[random(0, links.length)])

                    await i.reply({ embeds: [embedRetribuir] })
                }
                else if (i.customId === '2') {
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
