import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "bruno",
            description: "Não falamos do bruno",
            disabled: false,
            aliases: []
        })
    }
    run = async (message: sMessage) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
            .setDescription(`**Não falamos do Bruno ${message.author}\nMas clique [aqui](https://youtu.be/dWcrZv5p7Jg) para ver essa obra de arte**`)
            .setThumbnail("https://i.ytimg.com/vi/dWcrZv5p7Jg/maxresdefault.jpg")
        await message.reply({
            content: null,
            embeds: [embed]
        })
    }
}
