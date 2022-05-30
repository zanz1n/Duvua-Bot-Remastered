import { applicationCommand } from "../../structures/applicationCommand"
import { Interaction, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js"
import { Bot } from "../../structures/Client"
import { Embed } from "../../types/Embed"

class MessageEmbed extends Embed {
    constructor(data?) {
        super(data)
        this.setFooter("Comando em testes")
    }
}

module.exports = class extends applicationCommand {
    constructor(client: Bot) {
        super(client, {
            name: 'Beijar',
            type: 'USER',
        })
    }
    run = async (interaction: Interaction) => {
        if (!interaction.isApplicationCommand()) return

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        const user = interaction.options.getUser('user')
        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const links = require('../../utils/gifs').gifs_a

        if (user.id === this.client.user.id) {
            embed.setDescription(`**Vamos manter nossa relação como uma amizade, ok ${interaction.user}?**`)
            return await interaction.reply({ embeds: [embed] })
        }

        else if (user === interaction.user) {
            embed.setTitle(`O amor está no ar!  \:heart:`).setDescription(`${interaction.user} beijou ${user}`)
                .setImage(links[random(0, links.length)])
            return await interaction.reply({ embeds: [embed] })
        }
        else {
            const dateNow = new Date
            embed.setTitle(`O amor está no ar!  \:heart:`)
                .setDescription(`${interaction.user} beijou ${user}`)
                .setImage(links[random(0, links.length)])
                .setFooter({
                    text: `Requisitado por ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({
                        format: 'png',
                        dynamic: false
                    })
                })
                .setTimestamp()

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
            await interaction.reply({ embeds: [embed], components: [button] })

            const filter = (btnInt: MessageComponentInteraction) => {
                return btnInt.user.id === user.id
            }
            const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 90000 })

            collector.on("collect", async (i) => {
                if (i.customId === `repeat${dateNow}`) {
                    repeat.setDisabled(true)
                    reject.setDisabled(true)
                    interaction.reply({ components: [button] })

                    const embedRetribuir = new MessageEmbed().setTitle(`As coisas estão pegando fogo aqui!  \:fire:`)
                        .setDescription(`${i.user} retribuiu o beijo de ${interaction.user}\nSerá que temos um novo casal aqui?  \:heart:`)
                        .setImage(links[random(0, links.length)])

                    await i.reply({ embeds: [embedRetribuir] })
                }
                else if (i.customId === `reject${dateNow}`) {
                    repeat.setDisabled(true)
                    reject.setDisabled(true)
                    interaction.reply({ components: [button] })

                    const slap = require('../../utils/gifs').gifs_b
                    const embedRetribuir = new MessageEmbed().setTitle(`Quem nunca levou um fora, né ${interaction.user.username}`)
                        .setDescription(`${i.user} negou o beijo de ${interaction.user}  \:broken_heart:`)
                        .setImage(slap[random(0, slap.length)])

                    await i.reply({ embeds: [embedRetribuir] })
                }
            })
        }
    }
}
