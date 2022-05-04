import Command, { sMessage } from '../../structures/Command'
import Bot from '../../structures/Client'
import {
    MessageEmbed
} from 'discord.js'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "avatar",
            description: "Exibe o avatar de um usuário",
            disabled: false,
            aliases: ['image'],
        })
    }
    run = async (message: sMessage) => {
        const user = message.mentions.users.first() || message.author
        const member = message.mentions.members.first() || message.member

        const embed = new MessageEmbed().setColor(member.displayHexColor)
        const image = user.displayAvatarURL({ dynamic: true, size: 2048 })

        embed.setAuthor("Avatar de " + user.username, user.displayAvatarURL()).setImage(image)
            .setFooter({ text: `Requisitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp().setDescription(`**Clique [aqui](${user.displayAvatarURL({ format: 'png' })}) para ver original!**`).setTimestamp()
        await message.channel.send({ embeds: [embed] })
    }
}
