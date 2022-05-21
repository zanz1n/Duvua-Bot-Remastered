import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    User,
    GuildMember
} from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "coins",
            description: "Mostra as moedas que alguém possui",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    name: "usuario",
                    description: "De quem você deseja ver o dinheiro",
                    type: 6,
                    required: false
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const user = interaction.options.getUser('usuario') as User || interaction.user
        const member = interaction.options.getMember('usuario') as GuildMember || interaction.member

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        if (user.bot) {
            if (user.id === this.client.user.id) {
                embed.setDescription(`**Não faça especulações sobre meu capital, ${interaction.user}**`)
                return await interaction.editReply({ content: null, embeds: [embed] })
            } else {
                embed.setDescription(`**Robos como ${user} não possuem dinheiro aqui, ${interaction.user}**`)
                return await interaction.editReply({ content: null, embeds: [embed] })
            }
        }

        const userDb = await this.client.db.getUserDbFromMember(interaction.member)
        const memberDb = await this.client.db.getMemberDbFromMember(interaction.member)

        await userDb.save()
        await memberDb.save()

        embed.setTitle(`\:moneybag: Banco de ${user.username}`)
            .setDescription(`\n
        **\:hole: Pratas: ${memberDb.silver_coins}
        \:coin: Moedas de ouro: ${userDb.gold_coins}
        \:hash: Level: ${memberDb.level}**\n
        Pratas e XP são contados por servidor
        Use /work para trabalhar
        `).setThumbnail(user.displayAvatarURL())
            .setFooter({
                text: `Requisitado por ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
        interaction.editReply({ content: null, embeds: [embed] })
    }
}
