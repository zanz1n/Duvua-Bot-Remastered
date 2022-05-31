import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'
import fetch from 'node-fetch'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "github",
            description: "Exibe informações de um perfil no github",
            disabled: false,
            aliases: ['gb']
        })
    }
    run = async (message: sMessage, args: string) => {
        const embed = new MessageEmbed()

        const userName = args.replace(" ", "").split(" ")[0]

        if (!userName || args.length <= 1) {
            embed.setDescription(`**Insira um nome válido, ${message.member.user}**`)
            return message.reply({ content: null, embeds: [embed] })
        }
        embed.setDescription(`**Procurando por "${userName}" [...]**`)
        const msg = await message.reply({ content: null, embeds: [embed] })

        fetch(`https://api.github.com/users/${userName}`, {
            method: 'GET',
            headers: {
                Accept: "application/vnd.github.v3+json"
            }
        }).then((res) => {
            return res.json()
        }).then((user: any) => {
            if (!user.login) {
                embed.setDescription(`**Usuário não encontrado**`)
            }
            else {
                const createdat = user.created_at.replace("-", "/").replace("-", "/").replace("T", " às ").replace("Z", "").slice(0, 10)
                const updatedat = user.updated_at.replace("-", "/").replace("-", "/").replace("T", " às ").replace("Z", "").slice(0, 10)

                embed.setAuthor("Github de " + user.login, user.avatar_url)
                    .setDescription(`[Link do perfil](${user.html_url})\n` +
                        "**Informações coletadas diretamente do github, todas as informações exibidas são públicas a todos que acessam o site.**\n"
                    )
                    .setThumbnail(user.avatar_url)
                    .addField("ℹ️ Tipo", `${user.type.replace("Organization", "Organização").replace("User", "Usuário")}`, true)
                    .addField("✅ Seguindo", `${user.followers}`, true).addField("🔁 Seguidores", `${user.following}`, true)
                    .addField("💾 Repositórios", `${user.public_repos}`, true).addField("📅 Criado em", `${createdat}`, true)
                    .addField("📅 Atualizado em", `${updatedat}`, true).addField("🙇 Nome", user.name || "N/A", true)
                    .addField("📧 Email", user.email || "N/A", true).addField("🏭 Organização", user.company || "N/A", true)
                    .addField("📜 Bio", user.bio || "O usuário não possui nenhuma bio")
            }

            msg.edit({ content: null, embeds: [embed] })
        }).catch((err) => {
            if (err) {
                embed.setDescription(`**Usuário não encontrado**`)
                msg.edit({ content: null, embeds: [embed] })
            }
        })
    }
}
