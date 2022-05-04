/**
 * 
 * COPY THIS FILE TO botconfig.ts AND REPLACE
 * THE INFORMATION WITH YOURS
 * 
 */

import { ColorResolvable } from "discord.js"

export default class Config {
    token: string
    serverid: string
    name: string
    embed_default_color: ColorResolvable
    prefix: string
    dev_mode: boolean
    mongodb_url: string
    cost: string
    log_all_loads: boolean

    constructor() {
        this.token = "" //YOUR TOKEN GOES HERE
        this.serverid = "" //THE SERVER ID THAT YOU WILL RUN THE TESTS
        this.name = "Bot" //THE NAME OF THE BOT
        this.embed_default_color = "#0000FF" //THE DEFAULT COLOR OF THE BOT MESSAGES
        this.prefix = "-" //THE DEFAULT PREFIX OF THE BOT
        this.dev_mode = true //IF THIS OPTION IS FALSE, THE serverid WILL NOT BE USED
        this.log_all_loads = false //
        this.cost = "R$: 10,99" //THE COST FOR THE BOT STAY ONLINE
        this.mongodb_url = "mongodb://localhost:27017/ticketTests" //THE URL OF YOUR MONGODB SERVER
    }
}
