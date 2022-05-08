import slashCommand, { sInteraction } from '../../structures/slashCommand'
import Bot from '../../structures/Client'
import {
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    MessageComponentInteraction
} from 'discord.js'
import fetch from 'node-fetch'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "meme",
            description: "Exibe um meme aleatório do reddit",
            ephemeral: false,
            disabled: false,
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
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
                    Você gostaria de exibí-lo mesmo assim, ${interaction.user}?**`)
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
                    return btnInt.user.id === interaction.user.id
                }
                const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 20000 })

                collector.on("collect", async (i) => {
                    if (i.customId === `dataYes${dateNow}`) {
                        dataYes.setDisabled(true)
                        dataNo.setDisabled(true)
                        interaction.editReply({ components: [dataComponent] })

                        embed.setTitle(`${data.title}`)
                            .setURL(data.postLink)
                            .addField(`Post de`, `${data.author}`, true).addField(`Subreddit`, `${data.subreddit}`, true)
                            .addField(`Link`, `${data.postLink}`, true)
                            .setImage(data.url)
                        i.reply({ content: null, embeds: [embed] })
                    }
                    else if (i.customId === `dataNo${dateNow}`) {
                        dataYes.setDisabled(true)
                        dataNo.setDisabled(true)
                        interaction.editReply({ components: [dataComponent] })

                        embed.setDescription(`**O conteúdo não foi exibido por conter NSFW ou SPOILERS, [link original](${data.postLink})**`)
                        i.reply({ content: null, embeds: [embed] })
                    }
                })
                interaction.editReply({ content: null, embeds: [embed], components: [dataComponent] })
            } else {
                embed.setTitle(`${data.title}`)
                    .setURL(data.postLink)
                    .addField(`Post de`, `${data.author}`, true).addField(`Subreddit`, `${data.subreddit}`, true)
                    .addField(`Link`, `${data.postLink}`, true)
                    .setImage(data.url)

                interaction.editReply({ content: null, embeds: [embed] })
            }
        })
    }
}
