import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'
import {
    MessageButton,
    MessageActionRow,
    GuildMember,
    Permissions
} from 'discord.js'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "play",
            description: "Toca uma música do youtube",
            disabled: false,
            aliases: ['pl', 'p']
        })
    }
    run = async (message: sMessage, args: string) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        const member = message.member as GuildMember

        const guilDb = await this.client.db.getGuildDbFromMember(message.member)

        if (guilDb.strict_music_mode) {
            const memberDb = await this.client.db.getMemberDbFromMember(message.member)

            if (!memberDb.allowed_to_play || !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                embed.setDescription(`**Você não pode tocar músicas nesse servidor, ${message.member.user}**`)
                return message.reply({ content: null, embeds: [embed] })
            }
        }

        if (!member.voice.channel) {
            embed.setDescription(`**Você prefisa estart em um canal de voz para tocar uma música, ${message.author}**`)
            return message.reply({ content: null, embeds: [embed] })
        }

        if (args.length > 150 || args.length <= 1) {
            embed.setDescription(`**Insira uma URL válida, ${message.author}**`)
            return message.reply({ content: null, embeds: [embed] })
        }

        const player = this.client.manager.create({
            volume: 50,
            guild: message.guild.id,
            voiceChannel: member.voice.channel.id,
            textChannel: message.channel.id,
        })

        if (player.state !== 'CONNECTED') await player.connect()

        const search = args

        const res = await player.search(search, message.author)

        if (res.loadType === 'LOAD_FAILED') {
            if (!player.queue.current) player.destroy()
            embed.setDescription(`**Ocorreu um erro enquanto sua música era carregada, ${message.author}**`)
            return message.reply({ content: null, embeds: [embed] })
        }
        else if (res.loadType === 'PLAYLIST_LOADED') {
            if (!player.queue.current) player.destroy()

            embed.setDescription(`**Playlists não são permitidas, ${message.author}**`)
            return message.reply({ content: null, embeds: [embed] })
        }
        else if (res.loadType === 'NO_MATCHES') {
            if (!player.queue.current) player.destroy()
            embed.setDescription(`**Nenhuma música foi encontrada, ${message.author}**`)
            return message.reply({ content: null, embeds: [embed] })
        }
        else if (res.loadType === 'TRACK_LOADED') {
            player.queue.add(res.tracks[0])

            const song = res.tracks[0]
            const formatData = this.client.parseMsIntoFormatData(song.duration)

            if (!player.playing && !player.paused && !player.queue.size) player.play()

            embed.setDescription(`**[${song.title}](${song.uri})** foi adicionada a playlist\n\n**` +
                `Duração: [${formatData}]**`)
                .setThumbnail(song.displayThumbnail('default'))
                .setFooter({ text: `Requisitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
        }
        else if (res.loadType === 'SEARCH_RESULT') {
            player.queue.add(res.tracks[0])

            const song = res.tracks[0]
            const formatData = this.client.parseMsIntoFormatData(song.duration)

            if (!player.playing && !player.paused && !player.queue.size) player.play()

            embed.setDescription(`**[${song.title}](${song.uri})** foi adicionada a playlist\n\n**` +
                `Duração: [${formatData}]**`)
                .setThumbnail(song.displayThumbnail('default'))
                .setFooter({ text: `Requisitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
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

        await message.reply({ content: null, embeds: [embed], components: [button] })
    }
}
