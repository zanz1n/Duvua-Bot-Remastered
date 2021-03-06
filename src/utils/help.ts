import { slashCommand } from '../structures/slashCommand'
import {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu
} from 'discord.js'
import { config } from '../../botconfig'
import { Bot } from '../structures/Client'

export default {
    row: (dateNow: any) => {
        return new MessageActionRow().addComponents(
            new MessageSelectMenu().setCustomId('help').setPlaceholder('Escolha a categoria').setMinValues(1).setMaxValues(1)
                .addOptions([
                    {
                        label: "Fun", value: `fun${dateNow}`,
                        description: "Comandos para descontrair",
                        emoji: "🥳",
                    },
                    {
                        label: "Info",
                        value: `info${dateNow}`,
                        description: "Comandos para ver informações sobre o bot",
                        emoji: "ℹ️"
                    },
                    {
                        label:
                            "Moderation / Utility",
                        value: `mod-util${dateNow}`,
                        description: "Comandos para auxiliar na moderação e organização do server",
                        emoji: "🖋️"
                    },
                    {
                        label: "Music",
                        value: `music${dateNow}`,
                        description: "Comandos para tocar musicas do youtube",
                        emoji: "🎧"
                    },
                    {
                        label: "Money / Level",
                        value: `money${dateNow}`,
                        description: "Comandos relacionados ao sistema monetário e de ranks do bot",
                        emoji: "💸"
                    },
                ])
        )
    },
    index: (client: Bot, user: any, guilDb: any) => {
        return new MessageEmbed().setColor(config.embed_default_color)
            .setTitle("Help")
            .setDescription(`
            **${client.user} pode fazer muitas coisas para o seu servidor.**
            O que inclui tocar músicas, ver avatar de usuários, beijar alguém e até fazer um meme, confira todos os comandos do bot abaixo:\n
            **\:globe_with_meridians: - slash commands | \:m: - legacy commands**\n
            \:globe_with_meridians: - digite:  **/**  para ver as opções; \:m: - podem ser usados com o prefixo:  **${guilDb.prefix}** no chat`)

            .addField("ℹ️ Categorias", "**Para visualizar todas as categorias e comandos use a caixa de seleção abaixo.**")

            .setThumbnail(client.user.displayAvatarURL())

            .setFooter({ text: `Requisitado por ${user.username}`, iconURL: user.displayAvatarURL() }).setTimestamp()
    },
    fun: (client: Bot, user: any, guilDb: any) => {
        const find = (command: string) => { return client.slashCommands.find((c: slashCommand) => c.name === command).description || "Command not found" }

        return new MessageEmbed().setColor(client.config.embed_default_color)
            .addField("🥳 Fun", "Comandos for fun e de diversão em geral.")
            .addField("\:globe_with_meridians:\:m: kiss", find("kiss"), true)
            .addField("\:globe_with_meridians:\:m: avatar", find("avatar"), true)
            .addField("\:globe_with_meridians:\:m: bruno", find("bruno"), true)
            .addField("\:globe_with_meridians:\:m: meme", find("meme"), true)
            .addField("\:globe_with_meridians: facts year", "Exibe curiosidades sobre um ano", true)
            .addField("\:globe_with_meridians: facts number", "Exibe curiosidades sobre um número", true)
            .addField("\:globe_with_meridians:\:m: iss", find("iss"), true)
            .addField("\:globe_with_meridians: starwars", find("starwars"), true)
            .addField("\:globe_with_meridians:\:m: slap", find("slap"), true)
            .addField("\:m: count", "Conta até uma determinada quantidade", true)
            .addField("\:globe_with_meridians: pedro", find('pedro'), true)
            .addField("*", "*", true)
        //Conta até uma determinada quantidade
    },
    info: (client: Bot, user: any, guilDb: any) => {
        const find = (command: string) => { return client.slashCommands.find((c: slashCommand) => c.name === command).description || "Command not found" }

        return new MessageEmbed().setColor(client.config.embed_default_color)
            .addField("ℹ️ Info", "Comandos de inforomação em geral.")
            .addField("\:globe_with_meridians:\:m: ping", find("ping"), true)
            .addField("\:globe_with_meridians:\:m: info", find("info"), true)
            .addField("\:globe_with_meridians:\:m: help", find("help"), true)
            .addField("\:globe_with_meridians:\:m: anime", find("anime"), true)
            .addField("\:globe_with_meridians:\:m: github", find("github"), true)
            .addField("*", "*", true)
    },
    modUtil: (client: Bot, user: any, guilDb: any) => {
        const find = (command: string) => { return client.slashCommands.find((c: slashCommand) => c.name === command).description || "Command not found" }

        return new MessageEmbed().setColor(client.config.embed_default_color)
            .addField("🖋️ Utilidade / Moderação", "Comandos para auxiliar na moderação e organização do server.")
            .addField("\:globe_with_meridians: embed", find("embed"), true)
            .addField("\:globe_with_meridians: say", find("say"), true)
            .addField("\:globe_with_meridians:\:m: clear", find("clear"), true)
            .addField("\:globe_with_meridians: ban", find("ban"), true)
            .addField("\:globe_with_meridians: config wellcome", "Altera a mensagem de boas vindas", true)
            .addField("\:globe_with_meridians: config prefix", "Altera o prefixo do bot no servidor", true)
            .addField("\:globe_with_meridians:\:m: testwelcome", find("testwelcome"), true)
            .addField("\:globe_with_meridians: config enablewelcome", "Habilita ou desabilita a mensagem de welcome", true)
            .addField("*", "*", true)
            .addField("\:information_source: Dica", "**Nos comandos say e embed, use \\n para quebrar linha.**")
    },
    music: (client: Bot, user: any, guilDb: any) => {
        const find = (command: string) => { return client.slashCommands.find((c: slashCommand) => c.name === command).description || "Command not found" }

        return new MessageEmbed().setColor(client.config.embed_default_color)
            .addField("🎧 Música", "Todos os comandos relacionados a músicas.")
            .addField("\:globe_with_meridians:\:m: play", find("play"), true)
            .addField("\:globe_with_meridians:\:m: queue", find("queue"), true)
            .addField("\:globe_with_meridians: pause", find("pause"), true)
            .addField("\:globe_with_meridians: resume", find("resume"), true)
            .addField("\:globe_with_meridians:\:m: skip", find("skip"), true)
            .addField("\:globe_with_meridians:\:m: songinfo", find("songinfo"), true)
            .addField("\:globe_with_meridians:\:m: stop", find("stop"), true)
            .addField("\:globe_with_meridians: music dj add", "Adiciona um dj no server", true)
            .addField("\:globe_with_meridians: music dj remove", "Remove algum dj do server", true)
            .addField("\:globe_with_meridians: music strict mode", "Habilita ou desabilita o music strict mode", true)
            .addField("\:globe_with_meridians: music strict add", "Adiciona pessoas que podem tocar musicas no servidor", true)
            .addField("\:globe_with_meridians: music strict remove", "Remove pessoas que podem tocar musicas no servidor", true)

            .addField("\:information_source: Dica", "**Quando o strict mode está ligado, apenas pessoas autorizadas podem tocar músicas**" +
                "**DJs podem controlar playlists e músicas sem que precisem de permissões adminitrativas no server.**\n")
    },
    money: (client: Bot, user: any, guilDb: any) => {
        const find = (command: string) => { return client.slashCommands.find((c: slashCommand) => c.name === command).description || "Command not found" }

        return new MessageEmbed().setColor(client.config.embed_default_color)
            .addField("💸 Dinheiro", "Todos os comandos relacionados ao sistema monetário.")
            .addField("\:globe_with_meridians: coins", find("coins"), true)
            .addField("\:globe_with_meridians: work", find("work"), true)
            .addField("\:globe_with_meridians:\:m: level", find("level"), true)
            .addField("\:globe_with_meridians: pay", find("pay"), true)
            .addField("*", "*", true).addField("*", "*", true)
    }
}
