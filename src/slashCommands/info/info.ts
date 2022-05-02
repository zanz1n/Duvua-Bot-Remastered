import slashCommand, { sInteraction } from '../../structures/slashCommand'
import Bot from '../../structures/Client'
import { MessageEmbed } from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "info",
            description: "Exibe informações sobre o bot",
            disabled: false,
            ephemeral: false
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        embed.setTitle("Sobre Mim").setDescription("Feita por <@586600481959182357>\n")
            .addField("Ajude o bot a continuar online!", `Para que o bot continue online, precisamos desenbolsar um custo mensal de ${this.client.config.cost}, ajude o projeto a continuar clicando **[aqui](https://www.youtube.com/).**\n`)
            .setThumbnail(this.client.user.displayAvatarURL())
            .addField("Comandos básicos:", `**help** - mostra os comandos do bot e dicas, use /help ou \`prefix\`help
            **ping** - mostra o ping do bot, use /ping ou \`prefix\`ping\n\n`)
            .addField("Tem alguma função legal que gostaria de ver no bot ou alguma sugestão?", "Sugira no nosso [servidor do discord](https://discord.com), a dm <@586600481959182357>, ou para coisas mais técnicas o [nosso github](https://github.com/zanz1n/Duvua-Bot-Remastered).")
        await interaction.editReply({ content: null, embeds: [embed] })
    }
}
