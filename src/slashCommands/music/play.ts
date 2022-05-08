import slashCommand, { sInteraction } from "../../structures/slashCommand"
import Bot from "../../structures/Client"
import {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
} from "discord.js"
import { QueryType } from 'discord-player'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "play",
            description: "Toca uma música do youtube",
            ephemeral: false,
            disabled: false,
            options: [
                {
                    name: "som",
                    description: "O link ou o nome da música",
                    type: 3,
                    required: true
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        const member = interaction.member as any

        if (!member.voice.channel) {
            embed.setDescription(`**Você prefisa estart em um canal de voz para tocar uma música, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }
        const queue = this.client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(member.voice.channel)

        if (interaction.options.getString("som").length > 80) {
            embed.setDescription(`**Não pesquiso nada com mais de 80 caracteres, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }

        let url = interaction.options.getString("som")
        var result = await this.client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_VIDEO
        })

        if (result.tracks.length == 0) {
            result = await this.client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_SEARCH
            })

            if (result.tracks.length == 0) {
                embed.setDescription(`**Nenhum som "${interaction.options.getString("som")}" encontrado, ${interaction.user}**`)
                return interaction.editReply({ content: null, embeds: [embed] })
            }
        }

        const song = result.tracks[0]
        queue.addTrack(song)

        embed.setDescription(`**[${song.title}](${song.url})** foi adicionada a playlist\n\n**Duração: [${song.duration}]**`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Requisitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() }).setTimestamp()

        if (!queue.playing) await queue.play()

        const skip = new MessageButton()
            .setCustomId(`skip`)
            .setEmoji(`⏭️`)
            .setLabel('Skip')
            .setStyle('PRIMARY')
        const stop = new MessageButton()
            .setCustomId(`stop`)
            .setEmoji(`⏹️`)
            .setLabel('Stop')
            .setStyle('DANGER')
        const pause = new MessageButton()
            .setCustomId(`pause`)
            .setEmoji(`⏸️`)
            .setLabel('Pause')
            .setStyle('PRIMARY')
        const resume = new MessageButton()
            .setCustomId(`resume`)
            .setEmoji(`▶️`)
            .setLabel('Resume')
            .setStyle('SUCCESS')

        const button = new MessageActionRow().addComponents(skip, stop, pause, resume)

        await interaction.editReply({ content: null, embeds: [embed], components: [button] })
    }
}
