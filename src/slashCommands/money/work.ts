import slashCommand, { sInteraction } from '../../structures/slashCommand'
import {
    MessageEmbed,
    User,
    GuildMember
} from 'discord.js'
import Bot from '../../structures/Client'
import Member from '../../database/models/member'
import dUser from '../../database/models/user'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "work",
            description: "Você trabalha e obtem dinheiro em troca"
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const user = interaction.user
        const member = interaction.member

        const userDb = await dUser.findById(interaction.user.id) ||
            new dUser({ _id: user.id, usertag: user.tag });

        const memberDb = await Member.findById(interaction.guild.id + user.id) ||
            new Member({
                _id: interaction.guild.id + user.id,
                guildid: interaction.guild.id,
                userid: user.id,
                usertag: user.tag
            })
        function interGer(n: number) {
            return n - n % 1
        }
        const sinceRequestMS = Number(Date.now() - userDb.last_daily_request)
        if (sinceRequestMS < 10800000) {
            const timeOut = Number(10800000 - sinceRequestMS)
            const hour = interGer(timeOut / 3600000)
            const minutes = interGer(timeOut / 60000 - hour * 60)
            const seconds = interGer(timeOut / 1000 - minutes * 60 - hour * 3600)

            let formatData

            if (hour != 0) {
                formatData = `\`${hour}h:${minutes}m:${seconds}s\``
            } if (hour == 0 || !hour) {
                formatData = `\`${minutes}m:${seconds}s\``
            } if (minutes == 0) {
                formatData = `\`${seconds}s\``
            }

            embed.setDescription(`**Você precisa esperar mais ${formatData} para trabalhar de novo.**`)

            await interaction.editReply({ content: null, embeds: [embed] })
        } else {
            userDb.last_daily_request = Date.now()

            const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

            const gold_coins = random(1, 10)
            const silver_coins = random(10, 100)

            embed.setDescription(`\:moneybag:  **Você trabalhou como ${userDb.job} e ganhou ${gold_coins} \:coin:  moedas de ouro e ${silver_coins} \:hole:  moedas de prata**
        Você agora possui ${userDb.gold_coins + gold_coins} \:coin:  moedas de ouro e ${memberDb.silver_coins + silver_coins} \:hole:  moedas de prata`)

            userDb.gold_coins += gold_coins
            memberDb.silver_coins += silver_coins

            interaction.editReply({ content: null, embeds: [embed] })

        }
        userDb.save()
        memberDb.save()
    }
}
