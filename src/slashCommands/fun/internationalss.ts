import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
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
