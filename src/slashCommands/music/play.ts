import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    GuildMember,
    MessageActionRow,
    MessageButton,
    Permissions
} from "discord.js"

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
        const member = interaction.member as GuildMember

        const guilDb = await this.client.db.getGuildDbFromMember(interaction.member)

        if (guilDb.strict_music_mode) {
            const memberDb = await this.client.db.getMemberDbFromMember(interaction.member)

            if (!memberDb.allowed_to_play || !interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                embed.setDescription(`**Você não pode tocar músicas nesse servidor, ${interaction.user}**`)
                return interaction.editReply({ content: null, embeds: [embed] })
            }
        }

        if (!member.voice.channel) {
            embed.setDescription(`**Você prefisa estart em um canal de voz para tocar uma música, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }

        if (interaction.options.getString("som").length > 80) {
            embed.setDescription(`**Não pesquiso nada com mais de 80 caracteres, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }

        const player = this.client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: interaction.channel.id,
        })

        if (player.state !== 'CONNECTED') await player.connect()

        const search = interaction.options.getString('som')

        const res = await player.search(search, interaction.user)

        if (res.loadType === 'LOAD_FAILED') {
            if (!player.queue.current) player.destroy()
            embed.setDescription(`**Ocorreu um erro enquanto sua música era carregada, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }
        else if (res.loadType === 'PLAYLIST_LOADED') {
            if (!player.queue.current) player.destroy()

            embed.setDescription(`**Playlists não são permitidas, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }
        else if (res.loadType === 'NO_MATCHES') {
            if (!player.queue.current) player.destroy()
            embed.setDescription(`**Nenhuma música foi encontrada, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }
        else if (res.loadType === 'TRACK_LOADED') {
            player.queue.add(res.tracks[0])

            const song = res.tracks[0]
            const formatData = this.client.parseMsIntoFormatData(song.duration)

            if (!player.playing && !player.paused && !player.queue.size) player.play()

            embed.setDescription(`**[${song.title}](${song.uri})** foi adicionada a playlist\n\n**` +
                `Duração: [${formatData}]**`)
                .setThumbnail(song.displayThumbnail('default'))
                .setFooter({
                    text: `Requisitado por ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
        }
        else if (res.loadType === 'SEARCH_RESULT') {
            player.queue.add(res.tracks[0])

            const song = res.tracks[0]
            const formatData = this.client.parseMsIntoFormatData(song.duration)

            if (!player.playing && !player.paused && !player.queue.size) player.play()

            embed.setDescription(`**[${song.title}](${song.uri})** foi adicionada a playlist\n\n**` +
                `Duração: [${formatData}]**`)
                .setThumbnail(song.displayThumbnail('default'))
                .setFooter({
                    text: `Requisitado por ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
        }
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
