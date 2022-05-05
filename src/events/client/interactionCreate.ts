import Event from '../../structures/Event'
import Bot from '../../structures/Client'
import { sInteraction } from '../../structures/slashCommand'
import slashCommand from "../../structures/slashCommand"

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "interactionCreate"
        })
    }
    run = async (interaction: sInteraction) => {
        if (interaction.user.bot) return

        if (interaction.isCommand()) {
            const cmd = await this.client.slashCommands.find((c: slashCommand) => c.name === interaction.commandName)

            if (!cmd) return

            if (cmd.ephemeral) {
                await interaction.deferReply({ ephemeral: true })
            } else {
                await interaction.deferReply({ ephemeral: false })
            }

            cmd.run(interaction).catch((err: Error) => {
                if (err) console.log("\x1b[31m[bot-err] something whent wrong trying to execute a slashCommand\x1b[0m\n",
                    err,
                    "\n\x1b[33m[bot-api] this may affect the usability of the bot\x1b[0m"
                )
            })
        }
        if (interaction.isButton()) {
            if (interaction.customId === "permaTicketButton") {
                await interaction.deferReply({ ephemeral: true })
                const permaTicket = require('../../structures/handleEternalTickets')
                const permaTicketHandler = new permaTicket(this.client)
                permaTicketHandler.run(interaction)
            } else {
                const cmd = await this.client.slashCommands.find((c: slashCommand) => c.name === interaction.customId)
                if (!cmd) return
                else {
                    await interaction.deferReply({})
                    cmd.run(interaction)
                }
            }
        }
    }
}
