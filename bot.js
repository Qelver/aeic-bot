'use strict'

const Discord = require('discord.js')

const { discordAuthToken, serverName } = require('./config')
const commands = require('./include/commands')

const bot = new Discord.Client()
bot.login(discordAuthToken)

let serverInfo
bot.on('ready', () => {
  serverInfo = bot.guilds.find('name', serverName)
  console.log(`Bot Connecté au serveur ${serverName}.`)
})

bot.on('message', message =>
  commands.searchCommand(serverInfo, message))
