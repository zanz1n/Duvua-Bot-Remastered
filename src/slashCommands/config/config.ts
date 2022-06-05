import { slashCommand } from '../../structures/slashCommand'
import { sInteraction } from '../../types/Interaction'
import { Bot } from '../../structures/Client'
import { Embed as MessageEmbed } from '../../types/Embed'

import {
    Permissions
} from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "config",
            description: "Altera configurações do bot no servidor",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'welcome',
                    description: "Altera a mensagem de boas vindas do server",
                    options: [
                        {
                            name: "canal",
                            description: "O canal que você deseja usar as mensagens",
                            type: 7,
                            required: true
                        },
                        {
                            name: "mensagem",
                            description: "A mensagem de boas vindas que você deseja exibir",
                            type: 3,
                            required: true
                        },
                        {
                            name: "tipo",
                            description: "O tipo da mensagem de boas vindas [mensagem, embed, imagem]",
                            type: 3,
                            required: true,
                            choices: [
                                {
                                    name: "Mensagem",
                                    value: "message"
                                },
                                {
                                    name: "Embed",
                                    value: "embed"
                                },
                                {
                                    name: "Imagem",
                                    value: "image"
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'prefix',
                    description: "Altera o prefixo do bot para o servidor",
                    options: [
                        {
                            name: "prefixo",
                            description: "O prefixo que deseja que o bot use",
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'enablewelcome',
                    description: "Habilita a mensagem de bem-vindo no server",
                    options: [
                        {
                            name: 'enable',
                            description: "Habilita ou desabilita a mensagem de welcome",
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
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        const subCommand = interaction.options.getSubcommand()

        if (!interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }
        const guilDb = await this.client.db.getGuildDbFromMember(interaction.member)

        await guilDb.save()
        if (subCommand === "welcome") {
            const type = interaction.options.getString('tipo')
            const channel = interaction.options.getChannel("canal")

            if (channel.type !== "GUILD_TEXT") {
                embed.setDescription(`**Você precisa selecionar um canal de texto válido, ${interaction.user.username}**`)
                return interaction.editReply({ content: null, embeds: [embed] })
            }
            guilDb.wellcome = {
                channel: channel.id,
                message: interaction.options.getString('mensagem'),
                enabled: true,
                type
            }
            await guilDb.save()
            embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user.username}**`)
            await interaction.editReply({ content: null, embeds: [embed] })
        }
        else if (subCommand === "prefix") {
            const prefix = interaction.options.getString("prefixo")

            guilDb.prefix = prefix
            guilDb.save()

            embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user.username}**\nAgora o novo prefixo é ${guilDb.prefix}`)
            await interaction.editReply({ content: null, embeds: [embed] })
        }
        else if (subCommand === "enablewelcome") {
            const options = interaction.options.getString('enable')

            if (options === 'true') {
                guilDb.wellcome.enabled = true
                if (guilDb.wellcome.channel !== "na") {
                    embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user.username}**
                Caso deseje mudar a mensagem ou o canal use /config welcome`)
                }

                else {
                    guilDb.wellcome.channel = interaction.channel.id
                    embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user.username}**
                O canal da mensagem foi definido como esse.
                Caso deseje mudar use /config welcome`)
                }

                guilDb.save()
                await interaction.editReply({ content: null, embeds: [embed] })
            } else if (options === 'false') {
                guilDb.wellcome.enabled = false
                guilDb.save()

                embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user.username}**\nAs mensagens de bem-vindo foram desabilitadas`)
                await interaction.editReply({ content: null, embeds: [embed] })
            }
        }
    }
}
