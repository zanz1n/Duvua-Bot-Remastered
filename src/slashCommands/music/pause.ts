import slashCommand, { sInteraction } from "../../structures/slashCommand"
import Bot from "../../structures/Client"
import {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Permissions
} from "discord.js"

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "pause",
            description: "Pausa a reprodução do bot",
            ephemeral: false,
            disable: false,
        })
    }
    run = async (interaction: sInteraction) => {
    }
}
