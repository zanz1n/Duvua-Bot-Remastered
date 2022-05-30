import { applicationCommand } from "../../structures/applicationCommand"
import { Interaction, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js"
import { Bot } from "../../structures/Client"
import { Embed as MessageEmbed } from "../../types/Embed"

class Embed extends MessageEmbed {
    constructor(data?) {
        super(data)
        this.setFooter("Comando em testes")
    }
}

module.exports = class extends applicationCommand {
    constructor(client: Bot) {
        super(client, {
            name: 'Estapear',
            type: 'USER',
        })
    }
    run = async (interaction: Interaction) => {
        if (!interaction.isApplicationCommand()) return

        const member = interaction.options.getMember('user')
        const user = interaction.options.getUser('user')

        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const gifLinks = require('../../utils/gifs').gifs_b

        const embed = new Embed()

        if (!user) {
            embed.setDescription(`**Insira um usuário válido, ${interaction.user}**`)
            return interaction.reply({ content: null, embeds: [embed] })
        }

        else if (user.id === this.client.user.id) {
            embed.setTitle(`Desvio e te mato!`)
                .setDescription(`**Você tenta me acertar, eu desvio e te mato, ${interaction.user}**`)

            return interaction.reply({ content: null, embeds: [embed] })
        }

        else if (user.id === interaction.user.id) {
            embed.setTitle("Treta! 🔥 🔥 🔥")
                .setDescription(`${interaction.user} estapeou ${user}`)
                .setImage(gifLinks[random(0, gifLinks.length)])
                .setFooter({
                    text: `Requisitado por ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({
                        format: 'png',
                        dynamic: false
                    })
                })

            return interaction.reply({ content: null, embeds: [embed] })
        }

        const dateNow = new Date

        embed.setTitle("Treta! 🔥 🔥 🔥")
            .setDescription(`${interaction.user} estapeou ${user}`)
            .setImage(gifLinks[random(0, gifLinks.length)])
            .setFooter({
                text: `Requisitado por ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({
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

        const collector = interaction.channel
            .createMessageComponentCollector({ filter, max: 1, time: 90000 })

        collector.on("collect", async (i) => {
            if (i.customId === `repeat${dateNow}`) {
                repeat.setDisabled(true)

                interaction.reply({ components: [component] })

                const embed = new Embed().setTitle(`A situação está fora de controle!  🔥`)
                    .setDescription(`${i.user} retribuiu o tapa de ${interaction.user}`)
                    .setImage(gifLinks[random(0, gifLinks.length)])

                i.reply({ content: null, embeds: [embed] })
            }
        })

        interaction.reply({ content: null, embeds: [embed], components: [component] })
    }
}
