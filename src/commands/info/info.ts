import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "info",
            description: "Exibe informações sobre o bot",
            disabled: false,
            aliases: ['information'],
        })
    }
    run = async (message: sMessage) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        embed.setTitle("Sobre Mim").setDescription("Feita por <@586600481959182357>\n")
            .addField("Ajude o bot a continuar online!", `Para que o bot continue online, precisamos desenbolsar um custo mensal de ${this.client.config.cost}, ajude o projeto a continuar clicando **[aqui](https://www.youtube.com/).**\n`)
            .setThumbnail(this.client.user.displayAvatarURL({
                dynamic: false,
                format: 'png',
                size: 512
            }))
            .addField("Comandos básicos:", `**help** - mostra os comandos do bot e dicas, use /help ou \`prefix\`help
            **ping** - mostra o ping do bot, use /ping ou \`prefix\`ping\n\n`)
            .addField("Tem alguma função legal que gostaria de ver no bot ou alguma sugestão?", "Sugira no nosso [servidor do discord](https://discord.com), a dm <@586600481959182357>, ou para coisas mais técnicas o [nosso github](https://github.com/zanz1n/Duvua-Bot-Remastered).")
        await message.reply({ content: null, embeds: [embed] })
    }
}
