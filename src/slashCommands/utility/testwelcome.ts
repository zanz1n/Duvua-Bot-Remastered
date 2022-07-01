import { slashCommand } from "../../structures/slashCommand";
import { Bot } from "../../structures/Client";
import { ColorResolvable, Interaction, Permissions, TextChannel } from "discord.js";
import { Embed } from "../../types/Embed";
import Canvacord from "canvacord";

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "testwelcome",
            description: "Testa a mensagem de welcome do server",
            disabled: false,
            ephemeral: false,
        })
    }

    run = async (interaction: Interaction) => {
        if (!(interaction.isCommand() &&
            (interaction.deferred || interaction.replied))) return

        const embed = new Embed()

        if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }

        const { member } = interaction

        let guilDb: any = await this.client.db.getGuildDbFromMember(member)

        if (guilDb.wellcome.channel == 'na') {
            embed.setDescription(`**Não há nenhum canal configurado para enviar a mensagem, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }

        const channel = interaction.guild.channels.cache.get(guilDb.wellcome.channel) as TextChannel

        if (!channel) return
        if (!guilDb.wellcome.enabled) return

        const type = guilDb.wellcome.type
        if (type === 'embed') {
            embed.setTitle(`Bem vindo ${member.user.username}`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setDescription(guilDb.wellcome.message)
            await channel.send({ embeds: [embed] })
        } else if (type === 'message') {
            await channel.send(`${member}, ${guilDb.wellcome.message}`)
        } else if (type === 'image') {
            const welcomeImage: any = new Canvacord.Welcomer()

            const color: ColorResolvable = '#8814fc'
            const textColor: ColorResolvable = '#f1f1f1'

            welcomeImage.setAvatar(interaction.user.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setUsername(member.user.username)
                .setDiscriminator(member.user.discriminator)
                .setGuildName(interaction.guild.name)
                .setMemberCount(interaction.guild.memberCount)
                .setBackground('https://izan.studio/assets/wellcome_01.png')
                .setText("title", "Bem Vindo")
                .setColor("border", color)
                .setColor("username-box", color)
                .setColor("discriminator-box", color)
                .setColor("message-box", color)
                .setColor("title", textColor)
                .setColor("username", textColor)
                .setColor("message", textColor)
                .setColor("discriminator", textColor)
                .setColor("avatar", color)
                .setText("message", guilDb.wellcome.message)
                .setText("member-count", `${interaction.guild.memberCount}° membro!`)

            const image = await welcomeImage.build()

            await channel.send({ content: `${member.user}`, files: [image] })
        }
        await interaction.editReply({
            content: null,
            embeds: [
                new Embed().setDescription(`**Messagem enviada**`)
            ]
        })
    }
}
