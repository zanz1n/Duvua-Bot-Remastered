import slashCommand, { sInteraction } from '../../structures/slashCommand'
import { MessageEmbed, MessageActionRow, MessageButton, Permissions } from 'discord.js'
import Bot from '../../structures/Client'
import guild from '../../database/models/guild'

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
                    name: 'wellcome',
                    description: "Altera a mensagem de boas vindas do server",
                    options: [{
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
                    }]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'prefix',
                    description: "Altera o prefixo do bot para o servidor",
                    options: [{
                        name: "prefixo",
                        description: "O prefixo que deseja que o bot use",
                        type: 3,
                        required: true
                    }]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'disablewellcome',
                    description: "Desabilita a mensagem de bem-vindo no server"
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'enablewellcome',
                    description: "Habilita a mensagem de bem-vindo no server"
                }
            ]
        })
    }
    run = async (interaction: sInteraction) => {
        const embed = new MessageEmbed().setColor(this.client.config.embed_default_color)
        const subCommand = interaction.options.getSubcommand()

        if (!interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            embed.setDescription(`**Você não tem permissão para usar esse comando, ${interaction.user}**`)
            return await interaction.editReply({ content: null, embeds: [embed] })
        }
        const guilDb = await guild.findById(interaction.guild.id) ||
            new guild({ _id: interaction.guild.id, name: interaction.guild.name })

        await guilDb.save()
        if (subCommand === "wellcome") {
            const channel = interaction.options.getChannel("canal")
            if (channel.type !== "GUILD_TEXT") {
                embed.setDescription(`**Você precisa selecionar um canal de texto válido, ${interaction.user.username}**`)
                return await interaction.editReply({ content: null, embeds: [embed] })
            }
            guilDb.wellcome = {
                channel: channel.id,
                message: interaction.options.getString('mensagem'),
                enabled: true,
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
        else if (subCommand === "disablewellcome") {
            guilDb.wellcome.enabled = false
            guilDb.save()

            embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user.username}**\nAs mensagens de bem-vindo foram desabilitadas`)
            await interaction.editReply({ content: null, embeds: [embed] })
        }
        else if (subCommand === "enablewellcome") {
            guilDb.wellcome.enabled = true
            if (guilDb.wellcome.channel !== "na") {
                embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user.username}**
            Caso deseje mudar a mensagem ou o canal use /config wellcome`)
            } else {
                guilDb.wellcome.channel = interaction.channel.id
                embed.setDescription(`**Configurações salvas com sucesso, ${interaction.user.username}**
            O canal da mensagem foi definido como esse.
            Caso deseje mudar use /config wellcome`)
            }
            guilDb.save()
            await interaction.editReply({ content: null, embeds: [embed] })
        }
    }
}
