'use strict'

const Discord = require('discord.js')

const {
  discordAuthToken,
  serverName,
  database,
  homeChannelId
} = require('./config')
const { getBotMsg } = require('./include/botMessages')
const util = require('./include/util')
const sqlQueries = require('./include/sqlQueries')
const { searchCommand } = require('./include/commands')


const bot = new Discord.Client()
bot.login(discordAuthToken)

let serverInfo
bot.on('ready', () => {
  // Récupérer les infos du serveur
  serverInfo = bot.guilds.find('name', serverName)

  // Lire les messages présents dans config-notifications (Pour regarder l'ajout de réaction)
  serverInfo.channels.find('name', 'config-notifications').fetchMessages({ limit: 50 })

  console.log(`Bot Connecté au serveur ${serverName}.`)
})

// Chercher les commandes quand un message est reçu dans le serveur
bot.on('message', message => searchCommand(serverInfo, message))


// Ajouter/supprimer les rôles de notification
bot.on('messageReactionAdd', (reaction, user) => {
  if (reaction.message.channel.name === 'config-notifications' && reaction.emoji.name) {
    (async () => {
      const notifications = await database.query(sqlQueries.getAllNotifications)
      if (notifications.rows.find(x => x.notif_name === reaction.emoji.name))
        util.setRole(serverInfo, user, true, reaction.emoji.name)
    })().catch(console.error)
  }
})
bot.on('messageReactionRemove', (reaction, user) => {
  if (reaction.message.channel.name === 'config-notifications' && reaction.emoji.name) {
    (async () => {
      const notifications = await database.query(sqlQueries.getAllNotifications)
      if (notifications.rows.find(x => x.notif_name === reaction.emoji.name))
        util.setRole(serverInfo, user, false, reaction.emoji.name)
    })().catch(console.error)
  }
})


// Envoyer un message quand un nouvel utilisateur rejoins le serveur
bot.on('guildMemberAdd', user => {
  const channel = user.guild.channels.find(x => x.id === homeChannelId)
  if (channel) channel.send(getBotMsg('welcome-message', user))
})
