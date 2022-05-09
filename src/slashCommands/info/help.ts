import slashCommand, { sInteraction } from '../../structures/slashCommand'
import {
    SelectMenuInteraction,
    MessageComponentInteraction
} from 'discord.js'
import Bot from '../../structures/Client'
import Guild from '../../database/models/guild'
import replies from '../../utils/help'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "help",
            description: "Exibe as funções e os comandos do bot",
            ephemeral: false,
            disabled: false
        })
    }
    run = async (interaction: sInteraction) => {
        const { guild, user, channel } = interaction

        const dateNow = new Date
        const guilDb = await Guild.findById(guild.id) ||
            new Guild({ _id: guild.id, name: guild.name })

        const filter = (btnInt: MessageComponentInteraction) => btnInt.isSelectMenu() && btnInt.user.id === user.id

        const collector = channel.createMessageComponentCollector({ filter, time: 180000 })

        await interaction.editReply({
            content: null,
            embeds: [replies.index(this.client, user, guilDb)],
            components: [replies.row(dateNow)]
        })
        collector.on("collect", async (i: SelectMenuInteraction) => {
            const values = i.values[0]
            if (values === `fun${dateNow}`) {
                i.deferUpdate()
                interaction.editReply({ content: null, embeds: [replies.fun(this.client, user, guilDb)] })
            }
            else if (values === `info${dateNow}`) {
                i.deferUpdate()
                interaction.editReply({ content: null, embeds: [replies.info(this.client, user, guilDb)] })
            }
            else if (values === `mod-util${dateNow}`) {
                i.deferUpdate()
                interaction.editReply({ content: null, embeds: [replies.modUtil(this.client, user, guilDb)] })
            }
            else if (values === `music${dateNow}`) {
                i.deferUpdate()
                interaction.editReply({ content: null, embeds: [replies.music(this.client, user, guilDb)] })
            }
            else if (values === `money${dateNow}`) {
                i.deferUpdate()
                interaction.editReply({ content: null, embeds: [replies.money(this.client, user, guilDb)] })
            }
        })
    }
}
