import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import fetch from 'node-fetch'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "starwars",
            description: "Exibe informações aleatórias sobre star wars",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    name: "tipo",
                    description: "Pesquisarei por uma informação aleatória de uma categoria expecífica",
                    type: 3,
                    required: false,
                    choices: [
                        {
                            name: "Pessoas",
                            value: "people"
                        },
                        {
                            name: "Planetas",
                            value: "planets"
                        },
                        {
                            name: "Naves",
                            value: "starships"
                        }
                    ]
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed()
            .setFooter({
                text: `Requisitado por ${interaction.user.username}`,
                iconURL: `${interaction.user.displayAvatarURL({
                    dynamic: false,
                    format: 'png',
                    size: 128
                })}`
            })

        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const type = ['people', 'planets', 'starships']
        const starshipNumbers = [
            2, 3, 5, 9, 10, 11, 12, 13, 15, 17, 21, 22, 23, 27, 28, 29, 31, 32,
            39, 40, 41, 43, 47, 48, 49, 52, 58, 59, 61, 63, 64, 65, 66, 68, 74, 75
        ]
        const randomtype = interaction.options.getString('tipo') ||
            type[random(0, type.length)]
        const numbers = `${randomtype === 'people' ? random(1, 83) : randomtype === 'planets' ? random(1, 60) : starshipNumbers[random(1, 36)]}`

        if (this.client.config.dev_mode) console.log('[slashCommands/starwars] GET', `https://swapi.dev/api/${randomtype}/${numbers}`)

        fetch(`https://swapi.dev/api/${randomtype}/${numbers}`, {
            method: 'GET',
        }).then((res: any) => {
            return res.json()
        }).then(async (data) => {
            if (!data.name || data.name == undefined) {
                embed.setDescription(`**Houve um erro durante a pesquisa**\n
                    GET https://swapi.dev/api/${randomtype}/${numbers}`)
            } else {
                embed.setTitle(`${data.name}`)

                switch (randomtype) {
                    case 'people':
                        embed.setDescription(`**[Pessoa / Android](${data.url})**`)
                            .addField("⚧ Genero", `${data.gender}`, true)
                            .addField("⬆️ Altura", `${data.height}`, true)
                            .addField("⚖️ Massa", `${data.mass}`, true)
                            .addField("🧑‍🦰 Cor do cabelo", `${data.hair_color}`, true)
                            .addField("🧑‍🦲 Cor da pele", `${data.skin_color}`, true)
                            .addField("👁️ Cor dos olhos", `${data.eye_color}`, true)
                            .addField("📅 Nascimento", `${data.birth_year}`, true)
                            .addField("🎥 Filmes", `${data.films.length}`, true)
                            .addField("🚀 Veículos", `${data.vehicles.length + data.starships.length}`, true)
                        break
                    case 'planets':
                        embed.setDescription(`**[Planeta](${data.url})**`)
                            .addField("📅 Período de rotação", `${data.rotation_period}`, true)
                            .addField("🪐 Período de orbita", `${data.orbital_period}`, true)
                            .addField("🔵 Diametro", `${data.diameter}`, true)
                            .addField("🏝️ Clima", `${data.climate}`, true)
                            .addField("⛰️ Terreno", `${data.terrain}`, true)
                            .addField("🌍 Superficie de água", `${data.surface_water}`, true)
                            .addField("👱 População", `${data.population}`, true)
                            .addField("🎥 Filmes", `${data.films.length}`, true)
                            .addField("🕴️ Residentes", `${data.residents.length}`, true)
                        break

                    case 'starships':
                        embed.setDescription(`**[Nave](${data.url})**`)
                            .addField("✈️ Modelo", `${data.model}`, true)
                            .addField("🏭 Fabricante", `${data.manufacturer.length > 30 ? data.manufacturer.split(0, 30) + "..." : data.manufacturer}`, true)
                            .addField("💸 Custo", `${data.cost_in_credits}`, true)
                            .addField("🚀 Tamanho", `${data.length}`, true)
                            .addField("👱 Tripulação / Passageiros", `${data.crew} / ${data.passengers}`, true)
                            .addField("⚖️ Carga", `${data.cargo_capacity}`, true)
                            .addField("🛩️ Classe", `${data.starship_class}`, true)
                            .addField("🕴️ Pilotos", `${data.pilots.length}`, true)
                            .addField("🎥 Filmes", `${data.films.length}`, true)
                        break
                }
            }
            interaction.editReply({ content: null, embeds: [embed] })
        })
    }
}
