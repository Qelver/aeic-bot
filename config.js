'use strict'

require('dotenv').config()

const discordAuthToken = process.env.discordAuthToken
const serverName = process.env.serverName
const devDiscordId = process.env.devDiscordId
const configNotificationsChannelId = process.env.configNotificationsChannelId
const linkIcs = process.env.linkIcs

const { Pool } = require('pg')
const database = new Pool()

module.exports = {
  discordAuthToken,
  serverName,
  linkIcs,
  devDiscordId,
  configNotificationsChannelId,
  database
}
