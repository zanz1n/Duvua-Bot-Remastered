import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed } from '../../types/Embed'
import fetch from 'node-fetch'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "iss",
            description: "Exibe informações sobre a iss [International Space Station]",
            disabled: false,
            ephemeral: false,
        })
    }
    run = async (interaction: sInteraction) => {
        await fetch("http://api.open-notify.org/iss-now.json", {
            method: 'GET'
        }).then((res) => {
            return res.json()
        }).then(async (data) => {

            await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=` +
                `${data.iss_position.latitude},` +
                `${data.iss_position.longitude}` +
                `&key=${this.client.config.maps_api_key}`
            ).then((locationRes) => {
                if (this.client.config.dev_mode) console
                    .log(`GET https://maps.googleapis.com/maps/api/geocode/json?latlng=` +
                        `${data.iss_position.latitude},` +
                        `${data.iss_position.longitude}` +
                        `&key=${this.client.config.maps_api_key}`)
                return locationRes.json()
            }).then((location) => {
                const embed = new Embed().setFooter({
                    text: `Requisitado por ${interaction.user.username}`,
                    iconURL: `${interaction.user.displayAvatarURL({
                        dynamic: false,
                        format: 'png',
                        size: 128
                    })}`
                })
                    .setTitle("International Space Station")
                    .setThumbnail(`https://lh3.googleusercontent.com/bHzozJdMbN5D4jdkY0jG5lZdSKdJ0mwqnfScqnllXVVisDom5DkN992gSjWJpFfv`)
                    .setDescription(`**Fetch status:** ${data.message}`)
                    .addField("Latitude", `${data.iss_position.latitude}`, true)
                    .addField("Longitude", `${data.iss_position.longitude}`, true)
                    .addField("🗺️ Localização", "Retirada do google maps")
                    .addField("Endereço:", `${location.results[0].formatted_address}`)

                interaction.editReply({ content: null, embeds: [embed] })
            })
        })
    }
}
