import slashCommand, { sInteraction } from '../../structures/slashCommand'
import {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
    SelectMenuInteraction,
    MessageComponentInteraction
} from 'discord.js'
import Bot from '../../structures/Client'
import Guild from '../../database/models/guild'

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
        const dateNow = new Date
        const guilDb = await Guild.findById(interaction.guild.id) ||
            new Guild({ _id: interaction.guild.id, name: interaction.guild.name })

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const find = (command: string) => {
            return this.client.slashCommands.find((c: slashCommand) => c.name === command).description ||
                "Command not found"
        }

        embed.setTitle("Help")
            .setDescription(`
            **${this.client.user} pode fazer muitas coisas para o seu servidor.**
            O que inclui tocar músicas, ver avatar de usuários, beijar alguém e até fazer um meme, confira todos os comandos do bot abaixo:\n
            **\:globe_with_meridians: - slash commands | \:m: - legacy commands**\n
            \:globe_with_meridians: - digite:  **/**  para ver as opções; \:m: - podem ser usados com o prefixo:  **${guilDb.prefix}** no chat`)

            .addField("ℹ️ Categorias", "**Para visualizar todas as categorias e comandos use a caixa de seleção abaixo.**")

            .setThumbnail(this.client.user.displayAvatarURL())

            .setFooter({ text: `Requisitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }).setTimestamp()

        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu().setCustomId('help').setPlaceholder('Escolha a categoria').setMinValues(1).setMaxValues(1)
                .addOptions([
                    { label: "Fun", value: `fun${dateNow}`, description: "Comandos para descontrair", emoji: "🥳", },
                    { label: "Info", value: `info${dateNow}`, description: "Comandos para ver informações sobre o bot", emoji: "ℹ️" },
                    { label: "Moderation / Utility", value: `mod-util${dateNow}`, description: "Comandos para auxiliar na moderação e organização do server", emoji: "🖋️" },
                    { label: "Music", value: `music${dateNow}`, description: "Comandos para tocar musicas do youtube", emoji: "🎧" },
                    { label: "Money / Level", value: `money${dateNow}`, description: "Comandos relacionados ao sistema monetário e de ranks do bot", emoji: "💸" },
                ])
        )

        const filter = (btnInt: MessageComponentInteraction) => btnInt.isSelectMenu() && btnInt.user.id === interaction.user.id

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 180000 })

        collector.on("collect", async (i: SelectMenuInteraction) => {
            const values = i.values[0]
            if (values === `fun${dateNow}`) {
                const funEmbed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                    .addField("🥳 Fun", "Comandos for fun e de diversão em geral.")
                    .addField("\:globe_with_meridians:\:m: kiss", find("kiss"), true).addField("\:globe_with_meridians:\:m: avatar", find("avatar"), true)
                    .addField("\:m: bruno", "Não falamos do Bruno", true).addField("\:globe_with_meridians: meme", find("meme"), true)
                    .addField("*", "*", true).addField("*", "*", true)

                i.deferUpdate()
                interaction.editReply({ content: null, embeds: [funEmbed] })
            }
            else if (values === `info${dateNow}`) {
                const infoEmbed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                    .addField("ℹ️ Info", "Comandos de inforomação em geral.")
                    .addField("\:globe_with_meridians:\:m: ping", find("ping"), true).addField("\:globe_with_meridians: info", find("info"), true)
                    .addField("\:globe_with_meridians: help", find("help"), true).addField("\:globe_with_meridians:\:m: anime", find("anime"), true)
                    .addField("\:globe_with_meridians: github", find("github"), true).addField("*", "*", true)

                i.deferUpdate()
                interaction.editReply({ content: null, embeds: [infoEmbed] })
            }
            else if (values === `mod-util${dateNow}`) {
                const modUtilEmbed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                    .addField("🖋️ Utilidade / Moderação", "Comandos para auxiliar na moderação e organização do server.")
                    .addField("\:globe_with_meridians: embed", find("embed"), true).addField("\:globe_with_meridians: say", find("say"), true)
                    .addField("\:globe_with_meridians: clear", find("clear"), true).addField("\:globe_with_meridians: ban", find("ban"), true)
                    .addField("\:globe_with_meridians: config wellcome", "Altera a mensagem de boas vindas", true)
                    .addField("\:globe_with_meridians: config prefix", "Altera o prefixo do bot no servidor", true)
                //.addField("\:information_source: Dica", "**Nos comandos say e embed, use /n para quebrar linha.**")

                i.deferUpdate()
                interaction.editReply({ content: null, embeds: [modUtilEmbed] })
            }
            else if (values === `music${dateNow}`) {
                const musicEmbed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                    .addField("🎧 Música", "Todos os comandos relacionados a músicas.")
                    .addField("\:globe_with_meridians:\:m: play", find("play"), true).addField("\:globe_with_meridians:\:m: queue", find("queue"), true)
                    .addField("\:globe_with_meridians: pause", find("pause"), true).addField("\:globe_with_meridians: resume", find("resume"), true)
                    .addField("\:globe_with_meridians:\:m: skip", find("skip"), true).addField("\:globe_with_meridians: songinfo", find("songinfo"), true)
                    .addField("\:globe_with_meridians:\:m: stop", find("stop"), true).addField("*", "*", true).addField("*", "*", true)

                i.deferUpdate()
                interaction.editReply({ content: null, embeds: [musicEmbed] })
            }
            else if (values === `money${dateNow}`) {
                const moneyEmbed = new MessageEmbed().setColor(this.client.config.embed_default_color)
                    .addField("💸 Dinheiro", "Todos os comandos relacionados ao sistema monetário.")
                    .addField("\:globe_with_meridians: coins", find("coins"), true).addField("\:globe_with_meridians: work", find("work"), true)
                    .addField("\:globe_with_meridians:\:m: level", find("level"), true).addField("\:globe_with_meridians: pay", find("pay"), true)
                    .addField("*", "*", true).addField("*", "*", true)

                i.deferUpdate()
                interaction.editReply({ content: null, embeds: [moneyEmbed] })
            }

        })
        await interaction.editReply({ embeds: [embed], components: [row] })
    }
}
