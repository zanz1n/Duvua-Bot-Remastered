import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "avatar",
            description: "Mostra o avatar de um usuário",
            ephemeral: false,
            disabled: false,
            options: [
                {
                    name: "usuario",
                    description: "De quem você deseja exibir o avatar",
                    type: 6,
                    required: true
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const user = interaction.options.getUser('usuario') || interaction.user
        const member = interaction.options.getMember('usuario') || interaction.member

        const embed = new MessageEmbed().setColor(member.displayHexColor)
        const image = user.displayAvatarURL({ dynamic: true, size: 2048 })

        embed.setAuthor("Avatar de " + user.username, user.displayAvatarURL()).setImage(image)
            .setFooter({ text: `Requisitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp().setDescription(`**Clique [aqui](${user.displayAvatarURL({ format: 'png' })}) para ver original!**`)
        await interaction.editReply({ embeds: [embed] })
    }
}
