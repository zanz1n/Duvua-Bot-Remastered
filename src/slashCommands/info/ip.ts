import { slashCommand } from '../../structures/slashCommand'
import { Bot } from '../../structures/Client'
import { Embed } from '../../types/Embed'
import { Interaction } from 'discord.js'
import fetch from 'node-fetch'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "ip",
            description: "Procura por um ip e traz informações sobre ele",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    name: 'number',
                    type: 3,
                    description: "O ip que você deseja pesquisar",
                    required: true
                }
            ]
        })
    }

    run = async (interaction: Interaction) => {
        if (!(interaction.isCommand() &&
            (interaction.deferred || interaction.replied))) return

        const embed = new Embed()

        const ip = interaction.options.getString('number')

        await fetch(`http://ip-api.com/json/${ip}`, {
            method: 'GET',
        }).then(res => {
            return res.json()
        }).then((ipinfo: any) => {
            if (ipinfo.status !== 'success') {
                embed.setDescription(`**O endereço ip ${ip} não é válido, ${interaction.user}**`)
                return interaction.editReply({ content: null, embeds: [embed] })
            }

            embed.setTitle(`${ipinfo.query}`)
                .addFields([
                    {
                        name: 'País',
                        value: `${ipinfo.country}`,
                        inline: true
                    },
                    {
                        name: 'Região',
                        value: `${ipinfo.regionName}`,
                        inline: true
                    },
                    {
                        name: 'Cidade',
                        value: `${ipinfo.city}`,
                        inline: true
                    },
                    {
                        name: 'Zip',
                        value: `${ipinfo.zip}`,
                        inline: true
                    },
                    {
                        name: 'Provedora',
                        value: `${ipinfo.isp} - ${ipinfo.org}`,
                        inline: true
                    },
                    {
                        name: 'Coordenadas',
                        value: `LAT: ${ipinfo.lat}\nLON: ${ipinfo.lon}`,
                        inline: true
                    },
                ])
            return interaction.editReply({ content: null, embeds: [embed] })
        })
    }
}
