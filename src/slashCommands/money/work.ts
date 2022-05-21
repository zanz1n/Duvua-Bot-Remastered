import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "work",
            description: "Você trabalha e obtem dinheiro em troca",
            disabled: false,
            ephemeral: false
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)

        const user = interaction.user
        const member = interaction.member

        const userDb = await this.client.db.getUserDbFromMember(interaction.member)

        const memberDb = await this.client.db.getMemberDbFromMember(interaction.member)

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
