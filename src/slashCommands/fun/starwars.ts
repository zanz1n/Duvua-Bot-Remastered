import slashCommand, { sInteraction } from '../../structures/slashCommand'
import Bot from '../../structures/Client'
import {
    MessageEmbed
} from 'discord.js'
import fetch from 'node-fetch'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "starwars",
            description: "Exibe informações aleatórias sobre star wars",
            disabled: false,
            ephemeral: false,
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const type = ['people', 'planets'/*,'starships'*/]
        const randomtype = type[random(0, type.length)]
        const numbers = `${randomtype === 'people' ? random(1, 83) : randomtype === 'planets' ? random(1, 60) : random(1, 5)}`

        if (this.client.config.dev_mode) console.log('GET', `https://swapi.dev/api/${randomtype}/${numbers}`)
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
                if (randomtype === 'people') {
                    embed.setDescription(`**Pessoa**`)
                    embed.addField("Genero", `${data.gender}`, true)
                        .addField("Altura", `${data.height.replace("unknown", "desconhecido")}`, true)
                        .addField("Massa", `${data.mass.replace("unknown", "desconhecido")}`, true)
                        .addField("Cor do cabelo", `${data.hair_color.replace("none", "n/a")}`, true)
                        .addField("Cor da pele", `${data.skin_color.replace("none", "n/a")}`, true)
                        .addField("Cor dos olhos", `${data.eye_color.replace("unknown", "desconhecido")}`, true)
                        .addField("Nascimento", `${data.birth_year.replace("unknown", "desconhecido")}`, true)
                        .addField("Filmes", `${data.films.length}`, true)
                        .addField("Veículos", `${data.vehicles.length + data.starships.length}`, true)
                } else if (randomtype === 'planets') {
                    embed.setDescription(`**Planeta**`)
                        .addField("Período de rotação", `${data.rotation_period}`, true)
                        .addField("Período de orbita", `${data.orbital_period}`, true)
                        .addField("Diametro", `${data.diameter}`, true)
                        .addField("Clima", `${data.climate}`, true)
                        .addField("Terreno", `${data.terrain}`, true)
                        .addField("Superficie de água", `${data.surface_water}`, true)
                        .addField("População", `${data.population}`, true)
                        .addField("Filmes", `${data.films.length}`, true)
                        .addField("Residentes", `${data.residents.length}`)
                } else if (randomtype === 'starships') {
                    embed.setDescription(`**Nave**`)
                }
            }
            interaction.editReply({ content: null, embeds: [embed] })
        })
    }
}
