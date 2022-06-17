import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import Canvacord from 'canvacord'
import { GuildMember } from "discord.js";

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "level",
            description: "Mostra o level de algum membro do servidor",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    name: "usuario",
                    description: "De quem você deseja ver o level",
                    type: 6,
                    required: false
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const user = interaction.options.getUser('usuario') || interaction.user
        const member = interaction.options.getMember('usuario') || interaction.member
        if ((!(member instanceof GuildMember) || member.partial)) return

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        if (user.bot) {
            if (user.id === this.client.user.id) {
                embed.setDescription(`**Meu level é uma incógnita, ou talvez ele só não exista \:thinking:**`)

            } else embed.setDescription(`**${user} é um bot, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }
        const mensioned = await this.client.db.getMemberDbFromMember(interaction.member)

        mensioned.save()
        const meta = 3 * (mensioned.level ** 2)

        const rank = new Canvacord.Rank()
            .setAvatar(user.displayAvatarURL({
                dynamic: false,
                format: 'png'
            }))
            .setLevel(mensioned.level)
            .setCurrentXP(mensioned.xp)
            .setBackground("COLOR", "#464e4e")
            .setRank(0)
            .setRequiredXP(meta)
            .setProgressBar(member.displayHexColor, "COLOR")
            .setUsername(user.username)
            .setDiscriminator(user.discriminator)
        rank.build({}).then(data => {
            interaction.editReply({ content: null, files: [data] })
        })
    }
}
