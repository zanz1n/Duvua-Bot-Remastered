import { logger } from './logger'
import { Bot } from './structures/Client'

logger.log("log", "starting ...")

const client = new Bot()

client.start()
