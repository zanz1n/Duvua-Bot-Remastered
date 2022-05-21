import { Bot } from './Client'

export type EventOptionsType = {
    name: string
}

export class Event {
    client: Bot
    name: string

    constructor(client: Bot, options: EventOptionsType) {
        this.client = client
        this.name = options.name
    }
}
