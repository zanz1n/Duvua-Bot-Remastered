import { slashCommand } from "../../structures/slashCommand"
import { Bot } from "../../structures/Client";
import { Interaction, Permissions } from "discord.js";
import { sInteraction } from "../../types/Interaction";
import { Embed } from "../../types/Embed";

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "volume",
            description: "Exibe ou altera o volume da playlist que está tocando",
            disabled: false,
            ephemeral: false,
            options: [
                {
                    name: "set",
                    description: "Altera o volume do bot",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: "volume",
                            description: "O volume que deseja usar",
                            type: 'INTEGER',
                            required: true
                        }
                    ]
                },
                {
                    name: "show",
                    description: "Mostra o volume da playlist tocando",
                    type: 'SUB_COMMAND'
                }
            ]
        });
    }

    run = async (interaction: sInteraction) => {
        const subCommand = interaction.options.getSubcommand()
        const player = this.client.manager.get(interaction.guild.id)
        const embed = new Embed()

        if (!player || !player.queue.current) {
            embed.setDescription(`**Não há nenhuma música tocando, ${interaction.user}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }
        const realVolume = `${this.client.config.dev_mode ? "| " + player.volume : ""}`

        if (subCommand === "set") {
            const memberDb = await this.client.db.getMemberDbFromMember(interaction.member)
            const volume = interaction.options.getInteger("volume")

            if (interaction.memberPermissions.has(Permissions.FLAGS.MOVE_MEMBERS) || memberDb.dj) {
                if (volume > 200 || volume <= 2) {
                    embed.setDescription(`**O volume precisa ser um número entre 2 e 200, ${interaction.user}**`)
                    return interaction.editReply({ content: null, embeds: [embed] })
                }
                player.setVolume(parseInt((volume / 2).toString()))
                embed.setDescription(`**O volume foi alterado para ${volume}% ${realVolume}**`)
                return interaction.editReply({ content: null, embeds: [embed] })
            } else {
                embed.setDescription(`**Você não tem permissão para usar esse comando, ${interaction.user}**`)
                return interaction.editReply({ content: null, embeds: [embed] })
            }
        } else if (subCommand === "show") {
            embed.setDescription(`**O volume está em ${player.volume * 2}% ${realVolume}**`)
            return interaction.editReply({ content: null, embeds: [embed] })
        }
    }
}
