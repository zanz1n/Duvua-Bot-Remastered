import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import {
    Permissions,
    GuildMember,
} from 'discord.js'
import { Embed } from '../../types/Embed'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "music",
            description: "Configurações de música",
            ephemeral: false,
            disabled: false,
            options: [
                {
                    type: 2,
                    name: 'dj',
                    description: 'Configurações dos djs',
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
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'strict',
                    description: "Apenas membros autorizados poderão tocar músicas",
                    options: [
                        {
                            name: 'enable',
                            description: "Habilita ou desabilita o music strict mode",
                            type: 3,
                            required: true,
                            choices: [
                                {
                                    name: "Habilitado",
                                    value: "true"
                                },
                                {
                                    name: "Desabilitado",
                                    value: "false"
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const subCommandGroup = interaction.options.getSubcommandGroup()
        const subCommand = interaction.options.getSubcommand()
        const embed = new Embed()

        if (!interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }

        const guilDb = await this.client.db.getGuildDbFromMember(interaction.member)

        if (subCommandGroup === 'dj') {
            const member = interaction.options.getMember('usuario') as GuildMember
            const memberDb = await this.client.db.getMemberDbFromMember(member)
            if (subCommand === "add") {
                if (memberDb.dj) {
                    embed.setDescription(`**${member.user} já era um dj**\nNada mudou!`)
                } else {
                    embed.setDescription(`**${member.user} é um dj agora**`)
                }
                memberDb.dj = true
            } else if (subCommand === "remove") {
                if (!memberDb.dj) {
                    embed.setDescription(`**${member.user} não era um dj**\nNada mudou!`)
                } else {
                    embed.setDescription(`**${member.user} não é mais um dj**`)
                }
                memberDb.dj = false
            }
            await memberDb.save().then(async () => {
                await interaction.editReply({ content: null, embeds: [embed] })
            }).catch(async (err: Error) => {
                embed.setDescription(`**Não foi possível realizar a alteração, ${interaction.user}**`)
                console.log(err)
                await interaction.editReply({ content: null, embeds: [embed] })
            })
        }
        else if (subCommand === "strict") {
            const options = interaction.options.getString('enable')

            if (options === 'true') {
                if (guilDb.stric_music_mode === true) {
                    embed.setDescription(`**O strict mode já estava habilitado, ${interaction.user}**`)
                    return interaction.editReply({ content: null, embeds: [embed] })
                } else {
                    guilDb.stric_music_mode = true
                    embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user}**\nStric mode habilitado`)
                    await guilDb.save()
                    return interaction.editReply({ content: null, embeds: [embed] })
                }
            }
            else if (options === 'false') {
                if (guilDb.stric_music_mode === false) {
                    embed.setDescription(`**O strict mode já estava desabilitado, ${interaction.user}**`)
                    return interaction.editReply({ content: null, embeds: [embed] })
                } else {
                    guilDb.stric_music_mode = false
                    embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user}**\nStric mode desabilitado`)
                    await guilDb.save()
                    return interaction.editReply({ content: null, embeds: [embed] })
                }
            }
        }
    }
}
