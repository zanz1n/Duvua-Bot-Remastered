import slashCommand, { sInteraction } from '../../structures/slashCommand'
import Bot from '../../structures/Client'
import {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageComponentInteraction
} from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "kiss",
            description: "Beija alguém",
            ephemeral: false,
            disabled: false,
            options: [
                {
                    name: "usuario",
                    description: "A pessoa que você deseja beijar",
                    type: 6,
                    required: true
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        const user = interaction.options.getUser('usuario') || interaction.user
        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const links = require('../../utils/gifs').gifs_a

        if (user.id === this.client.user.id) {
            embed.setDescription(`**Vamos manter nossa relação como uma amizade, ok ${interaction.user}?**`)
            return await interaction.editReply({ embeds: [embed] })
        }
        else if (user.bot) {
            embed.setDescription(`**Você não pode beijar um bot ${interaction.user}!**`)
            return await interaction.editReply({ embeds: [embed] })
        }

        else if (user === interaction.user) {
            embed.setTitle(`O amor está no ar!  \:heart:`).setDescription(`${interaction.user} beijou ${user}`)
                .setImage(links[random(0, links.length)])
            return await interaction.editReply({ embeds: [embed] })
        }
        else {
            const dateNow = new Date
            embed.setTitle(`O amor está no ar!  \:heart:`).setDescription(`${interaction.user} beijou ${user}`).setImage(links[random(0, links.length)])
                .setFooter({ text: `Requisitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }).setTimestamp()

            const button = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`repeat${dateNow}`)
                    .setEmoji(`🔁`)
                    .setLabel('Retribuir')
                    .setStyle('PRIMARY')
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId(`reject${dateNow}`)
                    .setEmoji(`❌`)
                    .setLabel('Recusar')
                    .setStyle('PRIMARY')
                    .setDisabled(false)
            )
            await interaction.editReply({ embeds: [embed], components: [button] })

            const filter = (btnInt: MessageComponentInteraction) => {
                return btnInt.user.id === user.id
            }
            const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 90000 })

            collector.on("collect", async (i) => {
                if (i.customId === `repeat${dateNow}`) {
                    const embedRetribuir = new MessageEmbed().setTitle(`As coisas estão pegando fogo aqui!  \:fire:`)
                        .setDescription(`${i.user} retribuiu o beijo de ${interaction.user}\nSerá que temos um novo casal aqui?  \:heart:`)
                        .setImage(links[random(0, links.length)])

                    await i.reply({ embeds: [embedRetribuir] })
                }
                else if (i.customId === `reject${dateNow}`) {
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
