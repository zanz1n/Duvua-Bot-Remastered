import { MessageEmbed } from "discord.js";
import { config } from "../../botconfig";

export class Embed extends MessageEmbed {
    constructor(data?: Embed) {
        super(data)
        this.setColor(config.embed_default_color)
    }
}
