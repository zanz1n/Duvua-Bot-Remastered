import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'
import fetch from 'node-fetch'
import {
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
} from 'discord.js'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "meme",
            description: "Mostra o ping do bot e responde com pong",
            disabled: false,
            aliases: [],
        })
    }
    run = async (message: sMessage) => {
        const preEmbed = new MessageEmbed()
            .setDescription(`Pesquisando [...]`)
        const msg = await message.reply({
            content: null,
            embeds: [preEmbed]
        })
        const embed = new MessageEmbed()

        await fetch('https://meme-api.herokuapp.com/gimme/memes').then(res => {
            return res.json()
        }).then((data: any) => {
            if (data.nsfw || data.spoiler) {
                const dateNow = new Date
                if (data.nsfw) {
                    embed.setDescription(`**Nas nossas buscas, acabamos encontrando um meme NSFW!
                    Você gostaria de exibí-lo mesmo assim?**`)
                } else if (data.spoiler) {
                    embed.setDescription(`**Nas nossas buscas, acabamos encontrando um meme que contém SPOILER!
                    Você gostaria de exibí-lo mesmo assim, ${message.member.user}?**`)
                }
                const dataYes = new MessageButton()
                    .setCustomId(`dataYes${dateNow}`)
                    .setLabel('✅ Sim')
                    .setStyle('SUCCESS')
                const dataNo = new MessageButton()
                    .setCustomId(`dataNo${dateNow}`)
                    .setLabel('❌ Não')
                    .setStyle('DANGER')

                const dataComponent = new MessageActionRow().addComponents(dataYes, dataNo)

                const filter = (btnInt: MessageComponentInteraction) => {
                    return btnInt.user.id === message.member.user.id
                }
                const collector = message.channel.createMessageComponentCollector({ filter, max: 1, time: 20000 })

                collector.on("collect", async (i) => {
                    if (i.customId === `dataYes${dateNow}`) {
                        dataYes.setDisabled(true)
                        dataNo.setDisabled(true)
                        msg.edit({ components: [dataComponent] })

                        embed.setTitle(`${data.title}`)
                            .setURL(data.postLink)
                            .addField(`Post de`, `${data.author}`, true).addField(`Subreddit`, `${data.subreddit}`, true)
                            .addField(`Link`, `${data.postLink}`, true)
                            .setImage(data.url)
                            .setFooter({
                                text: `Requisitado por ${message.member.user.username}`,
                                iconURL: message.member.user.displayAvatarURL({
                                    format: 'png',
                                    dynamic: false
                                })
                            })

                        i.reply({ content: null, embeds: [embed] })
                    }
                    else if (i.customId === `dataNo${dateNow}`) {
                        dataYes.setDisabled(true)
                        dataNo.setDisabled(true)
                        msg.edit({ components: [dataComponent] })

                        embed.setDescription(`**O conteúdo não foi exibido por conter NSFW ou SPOILERS, [link original](${data.postLink})**`)
                        i.reply({ content: null, embeds: [embed] })
                    }
                })
                msg.edit({ content: null, embeds: [embed], components: [dataComponent] })
            } else {
                embed.setTitle(`${data.title}`)
                    .setURL(data.postLink)
                    .addField(`Post de`, `${data.author}`, true).addField(`Subreddit`, `${data.subreddit}`, true)
                    .addField(`Link`, `${data.postLink}`, true)
                    .setImage(data.url)
                    .setFooter({
                        text: `Requisitado por ${message.member.user.username}`,
                        iconURL: message.member.user.displayAvatarURL({ format: 'png', dynamic: false })
                    })

                msg.edit({ content: null, embeds: [embed] })
            }
        })
    }
}
