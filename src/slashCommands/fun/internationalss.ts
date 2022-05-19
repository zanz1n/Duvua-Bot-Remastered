import slashCommand, { sInteraction } from '../../structures/slashCommand'
import Bot from '../../structures/Client'
import {
} from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "internationalss",
            description: "Exibe informações sobre a iss [International Space Station]",
            disabled: true,
            ephemeral: false,
        })
    }
    run = async (interaction: sInteraction) => {

    }
}
