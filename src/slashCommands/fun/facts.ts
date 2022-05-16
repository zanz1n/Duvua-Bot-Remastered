import slashCommand, { sInteraction } from '../../structures/slashCommand'
import Bot from '../../structures/Client'
import {
    MessageEmbed
} from 'discord.js'
import fetch from 'node-fetch'
import translate from '@iamtraction/google-translate'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "facts",
            description: "Exibe curiosidades sobre algo que envolva números",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    type: 1,
                    name: "year",
                    description: "Exibe curiosidades sobre um ano",
                    options: [
                        {
                            name: "numero",
                            description: "O ano que você deseja saber sobre",
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: "number",
                    description: "Exibe curiosidades sobre um número",
                    options: [
                        {
                            name: "numero",
                            description: "O número que você deseja saber sobre",
                            type: 3,
                            required: true
                        }
                    ]
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const subCommand = interaction.options.getSubcommand()
        const number = interaction.options.getString("numero")
        const numParsed = Number(number)

        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (number.length > 20) {
            embed.setDescription(`**Não insira um número muito grande, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
        if (!numParsed) {
            embed.setDescription(`**Insira um número válido, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }

        if (subCommand === "year") {
            fetch(`http://numbersapi.com/${number}/year`, {
                method: "GET",
                headers: {},
            }).then((res: any) => {
                return res.text()
            }).then(async (data: any) => {
                const trad = await translate(data, {
                    to: "portuguese"
                })
                embed.setDescription(`**${trad.text}**`)
                await interaction.editReply({ content: null, embeds: [embed] })
            }).catch(async (err) => {
                console.log(err)
                const randomanswers = [
                    "é o ano em que a Terra provavelmente deu a volta ao Sol.",
                    "é o ano em que nada de notável aconteceu.",
                    "é o ano que não sabemos o que aconteceu.",
                    "é o ano em que nada de interessante aconteceu."
                ]
                embed.setDescription(`**${number} ${randomanswers[random(0, randomanswers.length)]}**`)
                await interaction.editReply({ content: null, embeds: [embed] })
            })
        } else if (subCommand === "number") {
            fetch(`http://numbersapi.com/${number}`, {
                method: "GET",
                headers: {},
            }).then((res: any) => {
                return res.text()
            }).then(async (data: any) => {
                const trad = await translate(data, {
                    to: "portuguese"
                })
                embed.setDescription(`**${trad.text}**`)
                await interaction.editReply({ content: null, embeds: [embed] })
            }).catch(async (err: Error) => {
                console.log(err.name)
                embed.setDescription(`**${number} é um número muito legal.**`)
                await interaction.editReply({ content: null, embeds: [embed] })
            })
        }
    }
}
