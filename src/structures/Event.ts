import { Client } from 'discord.js'
import Bot from '../structures/Client'

class Event {
    client: Bot
    name: string
    
    constructor(client: Bot, options:any) {
        this.client = client
        this.name = options.name
    }
}

export default Event
