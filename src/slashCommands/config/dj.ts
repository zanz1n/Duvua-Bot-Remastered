import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import {
    Permissions,
    MessageEmbed
} from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "dj",
            description: "Controla pessoas que podem gerenciar a playlist",
            ephemeral: false,
            disabled: false,
            options: [
                {
                    name: "add",
                    type: 1,
                    description: "Adiciona alguém que pode controlar a playlist",
                    options: [
                        {
                            name: "usuario",
                            description: "Quem você deseja tornar dj",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    type: 1,
                    description: "Remove alguém da lista de dj's",
                    options: [
                        {
                            name: "usuario",
                            description: "Quem você retirar o dj",
                            type: 6,
                            required: true
                        }
                    ]
                }
            ],
        })
    }
    run = async (interaction: sInteraction) => {
        const user = interaction.options.getUser('usuario')
        const subCommand = interaction.options.getSubcommand()

        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        if (!interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        } else {
            const memberDb = await this.client.db.getMemberDbFromMember(interaction.member)
            if (subCommand === "add") {
                if (memberDb.dj) {
                    embed.setDescription(`**${user} já era um dj**\nNada mudou!`)
                } else {
                    embed.setDescription(`**${user} é um dj agora**`)
                }
                memberDb.dj = true
            } else if (subCommand === "remove") {
                if (!memberDb.dj) {
                    embed.setDescription(`**${user} não era um dj**\nNada mudou!`)
                } else {
                    embed.setDescription(`**${user} não é mais um dj**`)
                }
                memberDb.dj = false
            }
            await memberDb.save().then(async () => {
                await interaction.editReply({ content: null, embeds: [embed] })
            }).catch(async (err: Error) => {
                embed.setDescription(`**ERRO: Não foi possível realizar a alteração, ${interaction.user}**`)
                console.log(err)
                await interaction.editReply({ content: null, embeds: [embed] })
            })
        }
    }
}
