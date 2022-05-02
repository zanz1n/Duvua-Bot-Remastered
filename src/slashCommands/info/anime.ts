import slashCommand, { sInteraction } from '../../structures/slashCommand'
import Bot from '../../structures/Client'
import { MessageEmbed } from 'discord.js'
import malScraper from 'mal-scraper'
import translate from '@iamtraction/google-translate'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "anime",
            description: "Procura por um anime na internet",
            ephemeral: false,
            disabled: false,
            options: [
                {
                    name: "nome",
                    description: "Nome do anime que deseja buscar",
                    type: 3,
                    required: true
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const req = interaction.options.getString('nome').split(/\s+/g).join(" ").toLowerCase()

        if (req.lenght > 80) {
            embed.setDescription(`**Não insira um nome com mais de 80 caracteres ${interaction.user.username}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        } else {
            embed.setDescription(`**Procurando por "${req}" [...]**`)
            await interaction.editReply({ content: null, embeds: [embed] })
            malScraper.getInfoFromName(req).then(async data => {
                const trad = await translate(data.synopsis.slice(0, 768), {
                    to: "portuguese"
                })
                embed.setDescription(`**[${data.title}](${data.url})**`).setThumbnail(data.picture)
                    .setTitle(`${data.ranked} ${data.englishTitle || data.title}`)

                    .addField("Exibição:", `${data.aired.replace("to", "até")}`, true).addField("Generos:", `${data.genres}`, true)
                    .addField("Studio:", `${data.studios}`, true).addField("Episódios:", `${data.episodes}`, true)
                    .addField("Score:", `${data.score}`, true).addField("Status:", `${data.status}`, true)

                    .addField("Sinopse:", `${trad.text.replace("[Escrito por MAL Rewrite]", " ").slice(0, 560)} [...]\n`)
                    .addField("\n**[Escrito por MAL Rewrite]**", `A sinopse acima está limitada à 560 palavras para não ocupar muito espaço em sua tela, para ver a original clique **[aqui](${data.url}).**\n`, true)

                    .setFooter({ text: `Requisitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }).setTimestamp()

                await interaction.editReply({ content: null, embeds: [embed] })

            }).catch(async err => {
                const embed2 = new MessageEmbed().setDescription(`**Sinto muito, mas não foi possível achar um anime com nome ${req}, ${interaction.user.username}**`)
                if (interaction.user.id === "586600481959182357") embed2.addField("Erro:", `\`\`\`diff\n-${err}\`\`\``)

                await interaction.editReply({ content: null, embeds: [embed2] })
            })
        }
    }
}
