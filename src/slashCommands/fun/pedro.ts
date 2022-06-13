import { slashCommand } from '../../structures/slashCommand'
import { Bot } from '../../structures/Client'
import { Embed } from '../../types/Embed'
import { Interaction } from 'discord.js'

module.exports = class extends slashCommand {
    constructor(client: Bot) {
        super(client, {
            name: "pedro",
            description: "Pedro alguma coisa",
            disabled: false,
            ephemeral: false
        })
    }
    run = async (interaction: Interaction) => {
        if (!(interaction.isCommand() &&
            (interaction.deferred || interaction.replied))) return

        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

        const pedroLinks = [
            "https://preview.redd.it/nryuk54llj481.png?auto=webp&s=79198d8b2ada21329c5ed97c08ea357c3286637f",
            "https://imageproxy.ifunny.co/crop:x-20,resize:640x,quality:90x75/images/84d3ae7bebd3a1b2cad22c0c7261e3dc2d14b0fcd6ec65b9fd276c4dc30f7530_1.jpg",
            "https://imageproxy.ifunny.co/crop:x-20,resize:640x,quality:90x75/images/54e8ca2008baf69b7d2b1b555b0ca63769c7c1b7ccd76eeec264f88ba9f99527_1.jpg",
            "https://cdn.discordapp.com/attachments/949789629119348756/955195762910838804/EnzcewMXIAIwJ8_.png",
            "https://cdn.discordapp.com/attachments/949789629119348756/955196121704173588/kvYlqk8Mph-53gZxp1k1UgSx_R3jn77KLKwf-vCeBrg.png",
            "https://cdn.discordapp.com/attachments/949789629119348756/955197069453303838/ElRBn9gWoAI1L9z.png",
            "https://cdn.discordapp.com/attachments/949789629119348756/955197388174286848/pedro-piadas-webchurrasco.png"
        ]

        const embed = new Embed().setImage(pedroLinks[random(0, pedroLinks.length)])

        return interaction.editReply({ content: null, embeds: [embed] })
    }
}
