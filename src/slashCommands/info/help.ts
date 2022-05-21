import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    SelectMenuInteraction,
    MessageComponentInteraction
} from 'discord.js'
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
        const guilDb = this.client.db.getGuildDbFromMember(interaction.member)

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
