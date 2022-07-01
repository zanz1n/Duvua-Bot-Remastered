import { Bot } from "../../structures/Client";
import { slashCommand } from "../../structures/slashCommand";
import { sInteraction } from "../../types/Interaction";
import { MessageEmbed } from "discord.js";
const sleep = (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)) }

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "clone",
            description: "Faz um clone de um usuário e manda uma mensagem de seu gosto",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    name: "usuario",
                    description: "Quem você deseja clonar",
                    required: true,
                    type: 'USER'
                },
                {
                    name: "message",
                    description: "O que você deseja fazer o clone falar",
                    required: true,
                    type: 'STRING'
                }
            ]
        })
    }
    public run = async (interaction: sInteraction) => {
        const user = interaction.options.getUser("usuario")
        const message = interaction.options.getString("message")

        const { channel } = interaction

        if (channel.type !== 'GUILD_TEXT') return

        const embed = new MessageEmbed().setDescription(`**Clone criado, ${interaction.user}**`)

        await interaction.editReply({ content: null, embeds: [embed] })

        const webhook = await channel.createWebhook(`${user.username}`, {
            avatar: user.displayAvatarURL({
                dynamic: false,
                format: 'png',
                size: 512
            }),
            reason: `Duvua Bot Webhooks`
        })

        await webhook.send(`${message}`)

        await sleep(10 * 1000).then(() => {
            webhook.delete()
        })
    }
}
