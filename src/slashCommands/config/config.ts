import slashCommand, { sInteraction } from '../../structures/slashCommand'
import { MessageEmbed, MessageActionRow, MessageButton, Permissions } from 'discord.js'
import Bot from '../../structures/Client'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "config",
            description: "Shows the bot ping and replies with pong",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'wellcome',
                    description: "Altera a mensagem de boas vindas do server",
                    options: [
                        {
                            name: "canal",
                            description: "O canal que você deseja usar as mensagens",
                            type: 7,
                            required: true
                        },
                        {
                            name: "mensagem",
                            description: "A mensagem de boas vindas que você deseja exibir",
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'prefix',
                    description: "Altera o prefixo do bot para o servidor",
                    options: [
                        {
                            name: "prefixo",
                            description: "O prefixo que deseja que o bot use",
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'disablewellcome',
                    description: "Desabilita a mensagem de wellcome no server"
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const button = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('yes').setLabel('Sim').setStyle('SUCCESS'),
            new MessageButton().setCustomId('no').setLabel('No').setStyle('DANGER')
        )
        interaction.editReply({ components: [button] })
    }
}
