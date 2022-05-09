import Command, { sMessage } from '../../structures/Command'
import Bot from '../../structures/Client'
import {
    MessageEmbed,
    MessageButton,
    MessageActionRow
} from 'discord.js'
import { QueryType } from 'discord-player'

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
        if (!args || args.length <= 1) {
            embed.setDescription(`**Você precisa inserir o nome de uma música, ${message.author}**`)
            return await message.reply({ embeds: [embed] })
        } else {
            if (args.length > 80) {
                embed.setDescription(`**Não pesquiso nada com mais de 80 caracteres, ${message.author}**`)
                return await message.reply({ content: null, embeds: [embed] })
            }
            const member = message.member as any

            if (!member.voice.channel) {
                embed.setDescription(`**Você prefisa estart em um canal de voz para tocar uma música, ${message.author}**`)
                return await message.reply({ content: null, embeds: [embed] })
            }
            embed.setDescription(`**Carregando ${args}  [...]**`)
            const msg = await message.reply({ content: null, embeds: [embed] })

            const queue = this.client.player.createQueue(message.guild)

            if (!queue.connection) await queue.connect(member.voice.channel)

            let url = args
            var result = await this.client.player.search(url, {
                requestedBy: message.author,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            if (result.tracks.length == 0) {
                result = await this.client.player.search(url, {
                    requestedBy: message.author,
                    searchEngine: QueryType.YOUTUBE_SEARCH
                })

                if (result.tracks.length == 0) {
                    embed.setDescription(`**Nenhum som "${args}" encontrado, ${message.author}**`)
                    return msg.edit({ content: null, embeds: [embed] })
                }
            }

            const song = result.tracks[0]
            queue.addTrack(song)

            embed.setDescription(`**[${song.title}](${song.url})** foi adicionada a playlist\n\n**Duração: [${song.duration}]**`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Requisitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() }).setTimestamp()

            if (!queue.playing) await queue.play()

            const skip = new MessageButton()
                .setCustomId(`skip`)
                .setLabel('⏭️ Skip')
                .setStyle('PRIMARY')
            const stop = new MessageButton()
                .setCustomId(`stop`)
                .setLabel('⏹️ Stop')
                .setStyle('DANGER')
            const pause = new MessageButton()
                .setCustomId(`pause`)
                .setLabel('⏸️ Pause')
                .setStyle('PRIMARY')
            const resume = new MessageButton()
                .setCustomId(`resume`)
                .setLabel('▶️ Resume')
                .setStyle('SUCCESS')

            const button = new MessageActionRow().addComponents(skip, stop, pause, resume)

            await msg.edit({ content: null, embeds: [embed], components: [button] })
        }
    }
}
