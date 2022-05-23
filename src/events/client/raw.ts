import { Event } from '../../structures/Event'
import { Bot } from '../../structures/Client'

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "raw"
        })
    }
    run = async (d) => {
        this.client.manager.updateVoiceState(d)
    }
}
