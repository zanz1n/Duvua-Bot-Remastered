import { slashCommand } from "../../structures/slashCommand"
import { Interaction } from "discord.js"
import { Embed } from "../../types/Embed"
import { Bot } from "../../structures/Client";

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "bruno",
            description: "Não falamos do bruno",
            ephemeral: false,
            disabled: false
        });
    }

    run = async (interaction: Interaction) => {
        if (!(interaction.isCommand() &&
            (interaction.deferred || interaction.replied))) return

        const embed = new Embed()
            .setDescription(`**Não falamos do Bruno ${interaction.user}\nMas clique [aqui](https://youtu.be/dWcrZv5p7Jg) para ver essa obra de arte**`)
            .setThumbnail("https://i.ytimg.com/vi/dWcrZv5p7Jg/maxresdefault.jpg")
        return interaction.editReply({ content: null, embeds: [embed] })
    }
}
